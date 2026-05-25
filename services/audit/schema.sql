-- Audit log hash-chained — AC5 da Story 0.2
-- Cada entrada encadeia o hash da anterior, tornando adulteração detectável.
-- Compatível com DuckDB (ambiente demo) e PostgreSQL (produção).

CREATE TABLE IF NOT EXISTS audit_events (
    id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    previous_hash TEXT        NOT NULL,
    current_hash  TEXT        NOT NULL,
    seq           BIGINT      GENERATED ALWAYS AS IDENTITY,
    timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id       TEXT        NOT NULL,
    action        TEXT        NOT NULL,
    resource      TEXT        NOT NULL,
    payload_json  JSONB,

    CONSTRAINT hash_not_empty      CHECK (current_hash  != ''),
    CONSTRAINT prev_hash_not_empty CHECK (previous_hash != '')
);

-- Índices para consultas operacionais
CREATE INDEX IF NOT EXISTS idx_audit_seq      ON audit_events (seq);
CREATE INDEX IF NOT EXISTS idx_audit_user     ON audit_events (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action   ON audit_events (action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_events (resource);
CREATE INDEX IF NOT EXISTS idx_audit_ts       ON audit_events (timestamp DESC);

-- View de validação rápida: mostra eventos onde o hash não bate com o anterior
-- (útil para diagnóstico em produção sem rodar o script Python completo)
CREATE VIEW IF NOT EXISTS audit_chain_breaks AS
SELECT
    e.seq,
    e.id,
    e.timestamp,
    e.previous_hash                     AS stored_previous_hash,
    prev.current_hash                   AS actual_previous_hash,
    e.previous_hash = prev.current_hash AS chain_ok
FROM audit_events e
LEFT JOIN audit_events prev ON prev.seq = e.seq - 1
WHERE e.seq > 1
  AND e.previous_hash != prev.current_hash;
