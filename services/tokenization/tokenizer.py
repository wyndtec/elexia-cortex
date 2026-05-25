"""
Tokenization engine — HMAC-SHA256 determinístico com storage DuckDB.
Pseudoanonimização conforme LGPD Art. 12.
"""
import hashlib
import hmac
import logging
import os
from datetime import datetime, timezone
from typing import Optional

import duckdb

logger = logging.getLogger(__name__)

# Prefixos por campo para facilitar diagnóstico sem expor o valor original
FIELD_PREFIXES: dict[str, str] = {
    "cpf": "cpf_",
    "email": "email_",
    "telefone": "tel_",
}

VALID_FIELDS = set(FIELD_PREFIXES.keys())


class TokenizerError(Exception):
    pass


class TokenNotFoundError(TokenizerError):
    pass


class InvalidFieldError(TokenizerError):
    pass


class Tokenizer:
    """
    Tokenizador determinístico: mesmo campo + valor → mesmo token (HMAC-SHA256).
    Armazena mapeamento token→valor em DuckDB para detokenização reversa.
    """

    def __init__(self, db_path: str, hmac_key: str) -> None:
        if not hmac_key:
            raise TokenizerError("TOKENIZATION_HMAC_KEY não pode ser vazio")
        self._hmac_key = hmac_key.encode("utf-8")
        self._db_path = db_path
        self._conn = duckdb.connect(db_path)
        self._init_schema()

    def _init_schema(self) -> None:
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS token_store (
                field       VARCHAR NOT NULL,
                token       VARCHAR NOT NULL,
                value       VARCHAR NOT NULL,
                created_at  TIMESTAMP DEFAULT current_timestamp,
                PRIMARY KEY (field, token)
            )
        """)
        self._conn.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS idx_token_store_lookup ON token_store (field, token)"
        )

    def _compute_token(self, field: str, value: str) -> str:
        """Calcula o token HMAC-SHA256 usando field:value como contexto."""
        context = f"{field}:{value}".encode("utf-8")
        raw = hmac.new(self._hmac_key, context, hashlib.sha256).hexdigest()
        prefix = FIELD_PREFIXES.get(field, f"{field}_")
        return f"{prefix}{raw}"

    def _validate_field(self, field: str) -> None:
        if field not in VALID_FIELDS:
            raise InvalidFieldError(f"Campo '{field}' inválido. Aceitos: {sorted(VALID_FIELDS)}")

    def tokenize(self, field: str, value: str) -> str:
        """
        Tokeniza um valor PII. Idempotente: mesmo campo+valor retorna o mesmo token.
        Persiste o mapeamento para permitir detokenização.
        """
        self._validate_field(field)
        if not value or not value.strip():
            raise TokenizerError("Valor para tokenização não pode ser vazio")

        token = self._compute_token(field, value)

        # INSERT OR IGNORE — se já existe, não sobrescreve (idempotente)
        self._conn.execute(
            """
            INSERT INTO token_store (field, token, value, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (field, token) DO NOTHING
            """,
            [field, token, value, datetime.now(timezone.utc)],
        )
        logger.info("Tokenized field=%s token_prefix=%s", field, token[:12])
        return token

    def detokenize(self, field: str, token: str) -> str:
        """
        Reverte um token para o valor original. Requer acesso autorizado.
        Lança TokenNotFoundError se o mapeamento não existir.
        """
        self._validate_field(field)
        result = self._conn.execute(
            "SELECT value FROM token_store WHERE field = ? AND token = ?",
            [field, token],
        ).fetchone()

        if result is None:
            raise TokenNotFoundError(f"Token não encontrado para field={field}")

        logger.info("Detokenized field=%s token_prefix=%s", field, token[:12])
        return result[0]

    def validate_token(self, field: str, token: str) -> bool:
        """Verifica se um token existe no store sem expor o valor."""
        self._validate_field(field)
        result = self._conn.execute(
            "SELECT 1 FROM token_store WHERE field = ? AND token = ? LIMIT 1",
            [field, token],
        ).fetchone()
        return result is not None

    def close(self) -> None:
        self._conn.close()
