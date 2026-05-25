#!/usr/bin/env python3
"""
Script de validação da integridade do audit log hash-chained — AC6 da Story 0.2.

Percorre TODOS os eventos em ordem de seq, recalcula o hash esperado para cada
um e verifica que a chain está íntegra. Qualquer adulteração retroativa
resulta em divergência de hash.

Exit codes:
  0 — chain íntegra, nenhuma adulteração detectada
  1 — chain corrompida (pelo menos um evento inválido)

Uso:
  python validate_chain.py --db-path /data/audit.duckdb
  python validate_chain.py --db-path /data/audit.duckdb --verbose
"""
import hashlib
import sys
from dataclasses import dataclass
from typing import Optional

import click
import duckdb

GENESIS_HASH = "GENESIS-0000000000000000000000000000000000000000000000000000000000000000"


def _compute_hash(
    previous_hash: str,
    timestamp: str,
    user_id: str,
    action: str,
    resource: str,
) -> str:
    raw = f"{previous_hash}|{timestamp}|{user_id}|{action}|{resource}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


@dataclass
class ValidationResult:
    seq: int
    event_id: str
    stored_hash: str
    expected_hash: str
    stored_previous_hash: str
    expected_previous_hash: str
    valid: bool

    @property
    def hash_match(self) -> bool:
        return self.stored_hash == self.expected_hash

    @property
    def chain_link_ok(self) -> bool:
        return self.stored_previous_hash == self.expected_previous_hash


@click.command()
@click.option("--db-path", default="/data/audit.duckdb", help="Caminho para o arquivo DuckDB")
@click.option("--verbose", is_flag=True, default=False, help="Mostrar detalhes de cada evento")
def validate(db_path: str, verbose: bool) -> None:
    """Valida a integridade da chain do audit log."""
    click.echo(f"Conectando ao banco: {db_path}")

    try:
        conn = duckdb.connect(db_path, read_only=True)
    except Exception as exc:
        click.echo(f"ERRO: Não foi possível abrir o banco: {exc}", err=True)
        sys.exit(1)

    try:
        rows = conn.execute(
            """
            SELECT id, previous_hash, current_hash, seq, timestamp, user_id, action, resource
            FROM audit_events
            ORDER BY seq ASC
            """
        ).fetchall()
    except Exception as exc:
        click.echo(f"ERRO: Falha ao ler audit_events: {exc}", err=True)
        sys.exit(1)
    finally:
        conn.close()

    total = len(rows)
    if total == 0:
        click.echo("Audit log vazio — nenhum evento para validar.")
        sys.exit(0)

    click.echo(f"Total de eventos: {total}")
    click.echo("Iniciando validação da chain...")

    results: list[ValidationResult] = []
    previous_hash_in_chain = GENESIS_HASH

    for row in rows:
        event_id, stored_previous_hash, stored_current_hash, seq, timestamp, user_id, action, resource = row

        # Normalizar para o mesmo formato ISO usado na inserção (isoformat com T e timezone)
        # str(timestamp) retorna "2026-05-25 20:00:00+00:00" (espaço) enquanto
        # datetime.isoformat() retorna "2026-05-25T20:00:00+00:00" (T) — formatos diferentes
        # que produziriam hashes distintos e quebrariam toda a validação.
        if hasattr(timestamp, "isoformat"):
            timestamp_str = timestamp.isoformat()
        else:
            timestamp_str = str(timestamp)

        expected_current_hash = _compute_hash(
            previous_hash=previous_hash_in_chain,
            timestamp=timestamp_str,
            user_id=user_id,
            action=action,
            resource=resource,
        )

        result = ValidationResult(
            seq=seq,
            event_id=str(event_id),
            stored_hash=stored_current_hash,
            expected_hash=expected_current_hash,
            stored_previous_hash=stored_previous_hash,
            expected_previous_hash=previous_hash_in_chain,
            valid=stored_current_hash == expected_current_hash
            and stored_previous_hash == previous_hash_in_chain,
        )
        results.append(result)

        if verbose:
            status = "OK" if result.valid else "FAIL"
            click.echo(
                f"  seq={seq:6d} [{status}] id={str(event_id)[:8]}... "
                f"action={action} resource={resource}"
            )

        # Avançar a chain independente da validade do evento
        # (para detectar TODAS as quebras, não parar no primeiro erro)
        previous_hash_in_chain = stored_current_hash

    invalid = [r for r in results if not r.valid]
    valid_count = total - len(invalid)

    click.echo("")
    click.echo("=" * 60)
    click.echo(f"  Total de eventos:  {total}")
    click.echo(f"  Eventos válidos:   {valid_count}")
    click.echo(f"  Eventos inválidos: {len(invalid)}")
    click.echo("=" * 60)

    if invalid:
        click.echo("\nEVENTOS COM ADULTERAÇÃO DETECTADA:", err=True)
        for r in invalid:
            click.echo(f"  seq={r.seq} id={r.event_id}", err=True)
            if not r.chain_link_ok:
                click.echo(
                    f"    previous_hash diverge:"
                    f"\n      armazenado: {r.stored_previous_hash}"
                    f"\n      esperado:   {r.expected_previous_hash}",
                    err=True,
                )
            if not r.hash_match:
                click.echo(
                    f"    current_hash diverge:"
                    f"\n      armazenado: {r.stored_hash}"
                    f"\n      esperado:   {r.expected_hash}",
                    err=True,
                )
        click.echo("\nCHAIN CORROMPIDA — adulteração detectada.", err=True)
        sys.exit(1)
    else:
        click.echo("\nCHAIN ÍNTEGRA — nenhuma adulteração detectada.")
        sys.exit(0)


if __name__ == "__main__":
    validate()
