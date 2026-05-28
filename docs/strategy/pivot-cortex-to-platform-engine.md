# Pivot Estrategico: Cortex → Engine de Dados/IA da Platform

**Data:** 28/Mai/2026
**Decisao do founder:** Cortex deixa de ser produto standalone. Vira a engine de dados e inteligencia que a Platform consome.
**Status:** Aprovado — base para replanejamento

---

## 1. POR QUE O PIVOT

| Motivo | Detalhe |
|--------|---------|
| Concorrencia com gigantes | AWS, GCP, Databricks ja fazem data lake/BI. Competir na infra = morte |
| Overlap com Platform | Platform ja tem CRM, Jornada Universal, churn, health score, behavioral. Cortex standalone duplicava 70% |
| Ciclo enterprise inviavel agora | R$800K-3M TCV, 12-18 meses de venda, precisa de vendedor senior e design partners |
| Platform e o caminho mais rapido | Produto ja existe, ja tem base, ja tem entrada no mercado |
| Moat esta no metodo, nao na infra | Jornada Universal como engine diagnostica + Identity Resolution + IA prescritiva = defensavel |

**PRD Cortex v1 (925 linhas) → DESCONTINUADO como produto standalone.**
**Stories 0.1-0.14 → REAVALIAR — aproveitaveis como servicos internos.**

---

## 2. NOVA DEFINICAO

### O que o Cortex PASSA A SER

**Cortex = conjunto de servicos de dados e IA que a Platform consome internamente.**

Nao e produto. Nao tem UI propria. Nao tem pricing. Nao tem branding separado.
E o "cerebro" da Platform — o que torna a Platform IMPOSSIVEL de copiar.

### Os 4 servicos Cortex

```
┌─────────────────────────────────────────────────────────┐
│                    ELEXIA PLATFORM                       │
│                   (apps/api + hub + web)                 │
│                                                         │
│   Jornada Universal  ·  CRM  ·  Dashboards  ·  UI      │
│          │                │              │               │
│          ▼                ▼              ▼               │
│   ┌─────────────────────────────────────────────┐       │
│   │          CORTEX ENGINE (servicos)            │       │
│   │                                             │       │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │       │
│   │  │ Identity  │  │ Scoring  │  │ Predict  │  │       │
│   │  │Resolution │  │ Engine   │  │ Engine   │  │       │
│   │  └──────────┘  └──────────┘  └──────────┘  │       │
│   │  ┌──────────────────────────────────────┐   │       │
│   │  │     Data Connectors (Airbyte)        │   │       │
│   │  └──────────────────────────────────────┘   │       │
│   └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

| Servico | O que faz | Tech | Onde vive |
|---------|-----------|------|-----------|
| **Identity Resolution** | Merge perfis duplicados cross-system. Match deterministico (CPF, email, telefone) + probabilistico (Jaro-Winkler) + PPRL (Bloom Filters) | Python | `packages/identity-resolution/` |
| **Scoring Engine** | Motor de scoring da Jornada Universal. Score 0-100 por fase com 12+ variaveis ponderadas. Diagnostico causal. Prescricoes automaticas | TypeScript | `packages/scoring-engine/` |
| **Predict Engine** | Churn prediction (XGBoost + SHAP), Health Score hibrido, Anomaly Detection (Isolation Forest), Next Best Action | Python (MLflow) | `services/predict/` |
| **Data Connectors** | Conectores plug-and-play: HubSpot, Shopify, Omie, PG/MySQL generico, RD Station | Airbyte | `services/connectors/` |

---

## 3. O QUE A PLATFORM GANHA

### Hoje (sem Cortex Engine)

| Capacidade | Como funciona | Limitacao |
|-----------|---------------|-----------|
| Churn score | Regras simples em `cs-intelligence/churn.ts` | So dados do CRM, sem ML real |
| Health score | Formula fixa em `cs-intelligence/health-score.ts` | Sem aprendizado, sem dados externos |
| Lead scoring | Regras manuais em `lead-scoring/` | Sem preditivo, sem dados de conversao reais |
| Dedup | `data-quality/DedupMatch` basico | Apenas dentro do CRM, sem cross-system |
| Jornada Universal | Scorecard com metricas simples (Epic 5) | Sem diagnostico causal, sem prescricao, sem benchmarks |
| Integracoes | `crm-adapters/` (HubSpot, RD Station, WTS) | Sincronizacao basica, sem unificacao |

### Depois (com Cortex Engine)

| Capacidade | Como funciona | Diferencial |
|-----------|---------------|-------------|
| **Identity Resolution** | PPRL + Bloom Filters + match probabilistico | 15K contatos → 9.2K pessoas unicas. Ninguem no BR faz |
| **Jornada como ENGINE** | Score multi-variavel + diagnostico causal + prescricao | "Fase 3 esta 38 PORQUE X, Y, Z → FACA isto" |
| **Churn prescritivo** | XGBoost + SHAP explainability | "Joao vai churnar → 3 motivos → acao: ligar hoje" |
| **Dados cross-system** | Airbyte conecta ERP, e-commerce, financeiro | Customer 360 real, nao so dados do CRM |
| **Benchmarks** | Agregacao anonimizada cross-tenant | "Empresas do seu porte tem score 72 na Retencao. Voce: 38" |
| **Anomalias** | Isolation Forest em tempo real | "Volume atipico de cancelamentos — investigar" |

### Isso e o que torna a Platform INCOPIAVEL

Um aventureiro com Cursor copia a UI em 2 semanas.
Ele NAO copia: Identity Resolution com PPRL, motor de scoring causal com 12 variaveis calibradas por vertical, churn prescritivo com SHAP, benchmarks cross-tenant anonimizados, e conectores nativos pro ecossistema BR.

---

## 4. O QUE ACONTECE COM O PROJETO ELEXIA-CORTEX

### Codigo que JA EXISTE e APROVEITAVEL

| Servico | Repo cortex | Status | Destino no Platform |
|---------|-------------|--------|---------------------|
| `services/tokenization/` | HMAC-SHA256, DuckDB | Done (Story 0.2) | `packages/tokenization/` |
| `services/rbac/` | 5 roles, middleware Hono.js | Done (Story 0.2) | Integrar com RBAC existente da Platform |
| `services/audit/` | Hash-chain SHA-256 | Done (Story 0.2) | `packages/audit-log/` |
| `infra/terraform/` | EKS, KMS, Vault HA | Done (Story 0.1) | Referencia para infra Platform |

### Stories reaproveitaveis (reescrever como stories da Platform)

| Story Cortex | Capacidade | Reuso | Nova story Platform |
|-------------|-----------|-------|---------------------|
| 0.4 (Lakehouse/C360) | Customer 360, dbt pipeline | **Parcial** — adaptar modelo de dados ao Prisma | Story: "Customer 360 cross-system" |
| 0.5 (Identity Resolution) | PPRL, Bloom Filters, matching | **Total** — servico independente | Story: "Identity Resolution Engine" |
| 0.6 (Airbyte + HubSpot) | Conector HubSpot | **Parcial** — Platform ja tem via crm-adapters | Avaliar se Airbyte agrega vs crm-adapters |
| 0.8 (Conector Omie) | Conector Omie | **Total** — Platform nao tem | Story: "Conector Omie plug-and-play" |
| 0.11 (AI Engine) | Churn, Health Score, Anomaly | **Total** — substitui cs-intelligence basico | Story: "Predict Engine — churn prescritivo" |
| 0.12 (Cube.dev) | Semantic layer | **Avaliar** — Platform usa Prisma, Cube.dev pode ser overhead | Avaliar necessidade |

### Stories que CAEM (nao se aplicam)

| Story Cortex | Por que cai |
|-------------|------------|
| 0.3 (Compliance Vanta/SOC2) | Enterprise standalone — Platform nao precisa agora |
| 0.7 (Shopify) | Avaliar demanda — nao e prioridade Platform |
| 0.9 (QuickBooks) | Mercado US — nao e prioridade agora |
| 0.10 (Salesforce) | Platform tem publico que usa HubSpot/Pipedrive, nao SF |
| 0.13 (AI Chat) | Cortado pelo conselho da V1 |
| 0.14 (Demo environment) | Sem sentido como produto separado |

---

## 5. PLANO DE EXECUCAO

### Fase 1 — Fundamentacao (4-6 semanas)

**Objetivo:** servicos core funcionando dentro do monorepo da Platform.

| # | O que | Tipo | Prioridade |
|---|-------|------|-----------|
| 1 | **Scoring Engine** — Motor da Jornada Universal: score 0-100 por fase com variaveis ponderadas, diagnostico causal, prescricoes | TypeScript package | P0 |
| 2 | **Identity Resolution** — Match deterministico + probabilistico + PPRL. Integra com CrmContact | Python service | P0 |
| 3 | **Conector PG/MySQL generico** — Importar dados de qualquer sistema via dump ou conexao direta | Service | P0 |
| 4 | Migrar `services/tokenization` e `services/audit` do cortex pro platform | Package | P1 |

### Fase 2 — Inteligencia (4-6 semanas)

**Objetivo:** Platform entrega inteligencia prescritiva, nao so dashboards.

| # | O que | Tipo | Prioridade |
|---|-------|------|-----------|
| 5 | **Predict Engine** — Churn com XGBoost + SHAP, substituir cs-intelligence basico | Python service | P0 |
| 6 | **Health Score hibrido** — Combina dados CRM + externo + comportamental | Integrado no Scoring | P1 |
| 7 | **Anomaly Detection** — Isolation Forest em metricas da Jornada | Integrado no Predict | P1 |
| 8 | **Conector Omie** — Dados financeiros/ERP para Customer 360 | Airbyte ou direto | P1 |

### Fase 3 — Moat (4-6 semanas)

**Objetivo:** funcionalidades que tornam impossivel copiar.

| # | O que | Tipo | Prioridade |
|---|-------|------|-----------|
| 9 | **Benchmarks cross-tenant** — Agregacao anonimizada, comparativo por segmento/porte | Service | P1 |
| 10 | **Next Best Action** — Prescricao automatica por contexto (fase + score + perfil) | Integrado | P2 |
| 11 | **Conectores adicionais** — RD Station, Pipedrive, Conta Azul | Sob demanda | P2 |

### Validacao com Congressy

O case Congressy continua sendo o primeiro dataset real:
- Testar Identity Resolution com 200K+ pessoas
- Testar Scoring Engine com dados de eventos mapeados na Jornada
- Validar conector PG/MySQL generico
- Gerar demo com dados reais (nao sinteticos)

---

## 6. HANDOFF PARA ELEXIA-PLATFORM

### Arquivos a transferir

```bash
# Servicos implementados (Done — Stories 0.1, 0.2)
cp -r elexia-cortex/services/tokenization/ elexia-platform/packages/tokenization/
cp -r elexia-cortex/services/audit/        elexia-platform/packages/audit-log/
cp -r elexia-cortex/services/rbac/         # avaliar merge com RBAC existente

# Documentacao estrategica (referencia)
cp elexia-cortex/docs/strategy/analysis-congressy-case.md       elexia-platform/docs/strategy/
cp elexia-cortex/docs/strategy/analysis-platform-cortex-synergy.md elexia-platform/docs/strategy/
cp elexia-cortex/docs/strategy/pivot-cortex-to-platform-engine.md  elexia-platform/docs/strategy/

# Infra como referencia (nao copiar direto — avaliar com infra Platform)
# elexia-cortex/infra/terraform/ → referencia para deploy futuro
```

### Novas stories a criar na Platform

| ID | Titulo | Baseada em | Prioridade |
|----|--------|-----------|-----------|
| Nova | Scoring Engine — Jornada Universal como motor diagnostico | Cortex 0.12 + Epic 5 | P0 |
| Nova | Identity Resolution — PPRL + merge cross-system | Cortex 0.5 | P0 |
| Nova | Conector PG/MySQL generico — importar dados externos | Gap identificado | P0 |
| Nova | Predict Engine — Churn prescritivo + SHAP | Cortex 0.11 | P0 |
| Nova | Migrar tokenizacao e audit log do Cortex | Cortex 0.2 | P1 |
| Nova | Conector Omie plug-and-play | Cortex 0.8 | P1 |
| Nova | Benchmarks cross-tenant anonimizados | Novo | P2 |

### Proximo passo concreto

1. **Aprovar este documento** — confirmar que a direcao esta correta
2. **Abrir o projeto elexia-platform** — ativar Cipher la
3. **Copiar os arquivos** listados acima
4. **Criar as stories** na Platform com base nesta tabela
5. **Congressy como primeiro teste** — validar Identity Resolution + Scoring com dados reais

---

## 7. O QUE ACONTECE COM ESTE REPOSITORIO (elexia-cortex)

| Opcao | Descricao |
|-------|-----------|
| **A: Arquivar** | Marcar como archived no GitHub. Codigo de referencia, nao desenvolvimento ativo |
| **B: Manter como lab** | Usar pra prototipar servicos Python (ML, Identity Resolution) antes de integrar na Platform |
| **C: Monorepo service** | Manter como repo de microservicos que a Platform consome via API |

**Recomendacao:** Opcao B no curto prazo (prototipar Identity Resolution e Predict Engine aqui), depois migrar pro Platform quando estiverem maduros.

---

## RESUMO DA DECISAO

```
ANTES:  Cortex = produto enterprise standalone (R$800K-3M, 12-18 meses ciclo)
AGORA:  Cortex = engine interna da Platform (servicos de dados/IA)

ANTES:  Compete com AWS/Databricks na infra
AGORA:  Compete com ninguem — metodo proprietario + tecnica avancada simplificada

ANTES:  Platform e Cortex sao dois produtos
AGORA:  Platform e O produto. Cortex e o que torna a Platform incopiavel.
```
