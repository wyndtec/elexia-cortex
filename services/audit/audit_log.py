"""
Audit log imutável hash-chained — AC5 da Story 0.2.
Cada evento encadeia o hash SHA-256 do evento anterior.
Adulterações retroativas quebram a chain e são detectadas por validate_chain.py.
"""
import asyncio
import hashlib
import json
import logging
import os
from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4

import duckdb

logger = logging.getLogger(__name__)

# Anchor da chain — hash do "evento zero" que não existe
GENESIS_HASH = "GENESIS-0000000000000000000000000000000000000000000000000000000000000000"

_DEFAULT_DB_PATH = os.getenv("AUDIT_DB_PATH", "/data/audit.duckdb")


def _compute_hash(
    previous_hash: str,
    timestamp: str,
    user_id: str,
    action: str,
    resource: str,
) -> str:
    """SHA-256 sobre a concatenação dos campos da chain. Determinístico."""
    raw = f"{previous_hash}|{timestamp}|{user_id}|{action}|{resource}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


class AuditLog:
    """
    Audit log persistente com hash-chaining.
    Thread-safe para uso em servidor async via asyncio.Lock.

    LIMITAÇÃO DE ESCALA — single-writer por processo:
    O asyncio.Lock garante serialização apenas dentro de um único processo
    Python (single-replica). Em ambiente multi-replica (Deployment com
    replicas > 1), múltiplas instâncias competem pelo mesmo arquivo DuckDB,
    o que causa corrupção de dados (DuckDB não suporta writes concorrentes
    entre processos distintos).

    Para produção multi-replica, substituir DuckDB por:
      - PostgreSQL com INSERT ... RETURNING e locking via advisory locks, OU
      - Serviço de audit dedicado com réplica única (deployment replicas: 1
        com PodDisruptionBudget e persistência em PVC ReadWriteOnce), OU
      - Fila de eventos (Kafka/SQS) com consumer single-threaded que persiste.

    No ambiente demo (single-pod), este design é correto e suficiente.
    """

    def __init__(self, db_path: str = _DEFAULT_DB_PATH) -> None:
        self._db_path = db_path
        self._conn = duckdb.connect(db_path)
        self._lock = asyncio.Lock()
        self._init_schema()

    def _init_schema(self) -> None:
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS audit_events (
                id            VARCHAR     NOT NULL PRIMARY KEY,
                previous_hash TEXT        NOT NULL,
                current_hash  TEXT        NOT NULL,
                seq           BIGINT,
                timestamp     TIMESTAMPTZ NOT NULL,
                user_id       TEXT        NOT NULL,
                action        TEXT        NOT NULL,
                resource      TEXT        NOT NULL,
                payload_json  TEXT,

                CONSTRAINT hash_not_empty      CHECK (current_hash  != ''),
                CONSTRAINT prev_hash_not_empty CHECK (previous_hash != '')
            )
        """)
        # seq manual para DuckDB (não suporta GENERATED ALWAYS AS IDENTITY)
        self._conn.execute(
            "CREATE SEQUENCE IF NOT EXISTS audit_seq START 1 INCREMENT 1"
        )
        self._conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_audit_seq ON audit_events (seq)"
        )

    def _get_latest_hash_sync(self) -> str:
        """Retorna o hash do último evento, ou GENESIS_HASH se não houver eventos."""
        result = self._conn.execute(
            "SELECT current_hash FROM audit_events ORDER BY seq DESC LIMIT 1"
        ).fetchone()
        return result[0] if result else GENESIS_HASH

    async def append(
        self,
        user_id: str,
        action: str,
        resource: str,
        payload: Optional[dict[str, Any]] = None,
    ) -> str:
        """
        Adiciona um evento ao audit log.
        Retorna o current_hash do evento criado.
        Thread-safe via asyncio.Lock.
        """
        async with self._lock:
            previous_hash = self._get_latest_hash_sync()
            now = datetime.now(timezone.utc)
            timestamp_iso = now.isoformat()

            current_hash = _compute_hash(
                previous_hash=previous_hash,
                timestamp=timestamp_iso,
                user_id=user_id,
                action=action,
                resource=resource,
            )

            event_id = str(uuid4())
            seq = self._conn.execute("SELECT nextval('audit_seq')").fetchone()[0]
            payload_json = json.dumps(payload) if payload is not None else None

            self._conn.execute(
                """
                INSERT INTO audit_events
                    (id, previous_hash, current_hash, seq, timestamp, user_id, action, resource, payload_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    event_id,
                    previous_hash,
                    current_hash,
                    seq,
                    timestamp_iso,
                    user_id,
                    action,
                    resource,
                    payload_json,
                ],
            )

            logger.info(
                "audit event seq=%d action=%s resource=%s user=%s hash_prefix=%s",
                seq,
                action,
                resource,
                user_id,
                current_hash[:12],
            )
            return current_hash

    def get_latest_hash(self) -> str:
        """Retorna o hash do último evento (sync — para uso em contextos não-async)."""
        return self._get_latest_hash_sync()

    def close(self) -> None:
        self._conn.close()


# Singleton para uso direto no serviço
audit_log = AuditLog()
