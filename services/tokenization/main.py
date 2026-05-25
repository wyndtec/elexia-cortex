"""
Tokenization Service — FastAPI microservice para pseudoanonimização de PII.
Implementa LGPD Art. 12 via tokenização determinística HMAC-SHA256.
"""
import logging
import os
from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

from tokenizer import InvalidFieldError, TokenNotFoundError, Tokenizer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

DB_PATH = os.getenv("TOKENIZATION_DB_PATH", "/data/tokens.duckdb")
HMAC_KEY = os.getenv("TOKENIZATION_HMAC_KEY", "")

# ---------------------------------------------------------------------------
# JWT verification mode
# ---------------------------------------------------------------------------
# SECURITY NOTE — Layered defense gap:
# Por padrão (SKIP_JWT_VERIFY=true), este serviço confia que o API Gateway
# upstream já verificou a assinatura do JWT. A role é lida diretamente do
# payload base64, SEM verificar a assinatura criptográfica localmente.
#
# RISCO: qualquer pod no cluster com acesso direto ao serviço (sem passar pelo
# API Gateway) pode forjar um JWT com role=owner e acessar /detokenize,
# expondo PII em texto plano.
#
# PRODUÇÃO OBRIGATÓRIO: definir SKIP_JWT_VERIFY=false e configurar
# JWT_JWKS_URI com o endpoint JWKS do provedor de identidade (Clerk, Auth0,
# Keycloak, etc.). Neste modo, python-jose ou authlib verifica a assinatura
# RS256/ES256 antes de qualquer autorização.
#
# O flag SKIP_JWT_VERIFY=true é EXCLUSIVO para ambiente demo/dev onde o
# serviço não é exposto fora do cluster e não há PII real.
# ---------------------------------------------------------------------------
SKIP_JWT_VERIFY = os.getenv("SKIP_JWT_VERIFY", "true").lower() == "true"
JWT_JWKS_URI = os.getenv("JWT_JWKS_URI", "")  # ex: https://your-domain/.well-known/jwks.json

if not SKIP_JWT_VERIFY and not JWT_JWKS_URI:
    raise RuntimeError(
        "JWT_JWKS_URI é obrigatório quando SKIP_JWT_VERIFY=false. "
        "Configure o endpoint JWKS do seu provedor de identidade."
    )

# Roles autorizadas a chamar /detokenize
DETOKENIZE_ALLOWED_ROLES = {"owner", "admin"}


# ---------------------------------------------------------------------------
# Lifespan — inicializa tokenizer na startup
# ---------------------------------------------------------------------------

_tokenizer: Tokenizer | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _tokenizer
    if not HMAC_KEY:
        raise RuntimeError("TOKENIZATION_HMAC_KEY não configurada — serviço não pode iniciar")
    _tokenizer = Tokenizer(db_path=DB_PATH, hmac_key=HMAC_KEY)
    logger.info("Tokenizer inicializado — db=%s", DB_PATH)
    yield
    if _tokenizer:
        _tokenizer.close()


app = FastAPI(
    title="Elexia Cortex — Tokenization Service",
    version="0.1.0",
    description="Pseudoanonimização de PII conforme LGPD Art. 12",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

FieldType = Literal["cpf", "email", "telefone"]


class TokenizeRequest(BaseModel):
    field: FieldType
    value: str

    @field_validator("value")
    @classmethod
    def value_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("value não pode ser vazio")
        return v.strip()


class TokenizeResponse(BaseModel):
    token: str
    field: str


class DetokenizeRequest(BaseModel):
    field: FieldType
    token: str


class DetokenizeResponse(BaseModel):
    value: str
    field: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_role_from_request(request: Request) -> str | None:
    """
    Extrai a role do JWT no header Authorization Bearer.

    Modo SKIP_JWT_VERIFY=true (demo/dev):
      Lê o claim 'role' diretamente do payload base64. A verificação de
      assinatura é delegada ao API Gateway upstream. NÃO usar com PII real.

    Modo SKIP_JWT_VERIFY=false (produção):
      Verifica a assinatura criptográfica do JWT contra o JWKS endpoint
      antes de ler qualquer claim. Requer JWT_JWKS_URI configurada.
      Instalar: pip install python-jose[cryptography] ou authlib.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.removeprefix("Bearer ")

    if not SKIP_JWT_VERIFY:
        # Modo produção: verificar assinatura antes de ler claims
        # Implementação com python-jose (adicionar à requirements.txt):
        #
        #   from jose import jwt as jose_jwt, jwk, JWTError
        #   import httpx
        #
        #   try:
        #       jwks = httpx.get(JWT_JWKS_URI, timeout=5).json()
        #       claims = jose_jwt.decode(token, jwks, algorithms=["RS256", "ES256"])
        #       return claims.get("role")
        #   except JWTError:
        #       return None
        #
        # TODO: implementar antes de usar em produção com PII real.
        logger.error(
            "SKIP_JWT_VERIFY=false mas verificação de assinatura não implementada. "
            "Bloqueando requisição por segurança."
        )
        return None

    # Modo demo: decodificar payload sem verificar assinatura
    try:
        import base64
        import json

        # JWT = header.payload.signature — decodificar apenas o payload
        parts = token.split(".")
        if len(parts) != 3:
            return None
        # Adicionar padding se necessário
        payload_b64 = parts[1] + "=" * (-len(parts[1]) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        return payload.get("role")
    except Exception:
        return None


def _require_detokenize_permission(request: Request) -> None:
    role = _get_role_from_request(request)
    if role not in DETOKENIZE_ALLOWED_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "Insufficient permissions",
                "required_roles": sorted(DETOKENIZE_ALLOWED_ROLES),
                "role": role,
            },
        )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "tokenization"}


@app.post("/tokenize", response_model=TokenizeResponse, status_code=status.HTTP_200_OK)
async def tokenize(body: TokenizeRequest) -> TokenizeResponse:
    """
    Tokeniza um valor PII. Idempotente — mesmo campo+valor retorna o mesmo token.
    Não requer autenticação especial (qualquer serviço interno pode tokenizar).
    """
    if _tokenizer is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Serviço não inicializado")
    try:
        token = _tokenizer.tokenize(field=body.field, value=body.value)
    except InvalidFieldError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.exception("Erro ao tokenizar field=%s", body.field)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao tokenizar",
        ) from exc

    return TokenizeResponse(token=token, field=body.field)


@app.post("/detokenize", response_model=DetokenizeResponse, status_code=status.HTTP_200_OK)
async def detokenize(body: DetokenizeRequest, request: Request) -> DetokenizeResponse:
    """
    Reverte um token para o valor PII original.
    Requer role 'admin' ou 'owner' no JWT (verificado pelo API Gateway upstream).
    """
    _require_detokenize_permission(request)
    if _tokenizer is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Serviço não inicializado")

    try:
        value = _tokenizer.detokenize(field=body.field, token=body.token)
    except TokenNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Token não encontrado para field={body.field}",
        )
    except InvalidFieldError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.exception("Erro ao detokenizar field=%s", body.field)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao detokenizar",
        ) from exc

    return DetokenizeResponse(value=value, field=body.field)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception at %s", request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal server error"},
    )
