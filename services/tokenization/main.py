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
        raise RuntimeError("TOKENIZATION_HMAC_KEY não configurada — servico nao pode iniciar")
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
    A verificação de assinatura JWT ocorre no API Gateway upstream —
    aqui apenas lemos o claim 'role' do payload (já validado).
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.removeprefix("Bearer ")
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
