# Arquitetura — Elexia Cortex

**Status:** Draft v0.1 — Maio 2026

---

## Princípios de Design

1. **Privacy-by-architecture** — dados sensíveis nunca saem do ambiente do tenant
2. **Multi-tenant por produto** — cada produto Elexia é um tenant isolado
3. **Federated-first** — o modelo global melhora sem centralizar dados brutos
4. **LGPD-compliant por padrão** — consentimento e linhagem em cada ingestion
5. **Open internamente, opaco externamente** — APIs claras para produtos Elexia, zero exposição para terceiros

---

## L1 — Data Lake

### Responsabilidade
Receber, validar e armazenar todos os eventos dos produtos Elexia de forma rastreável.

### Fluxo de Ingestão
```
Produto Elexia → Kafka topic → Ingestion Service → Anonymizer → Delta Lake (S3/MinIO)
```

### Anonimização por Tier

| Tier | Dado | Tratamento |
|------|------|-----------|
| T0 — Identificável | CPF, nome, email, telefone | Hash irreversível na borda (nunca entra no lake bruto) |
| T1 — Quasi-identificável | Idade faixa, CEP 5 dígitos, CID-10 | K-anonimato (k>=5) |
| T2 — Agregado | Contagens, médias, percentuais | Passa direto |
| T3 — Sintético | Dados gerados por modelo | Tag de proveniência obrigatória |

### Particionamento
```
lake/
  {produto}/
    {ano}/{mês}/{dia}/
      raw/        — dados originais anonimizados
      validated/  — após quality gates
      quarantine/ — falhas de validação
```

### Retenção por Produto
| Produto | Raw | Validated | Motivo |
|---------|-----|-----------|--------|
| MaisVIDA | 10 anos | 10 anos | Regulação CFM |
| Plataforma CRM | 5 anos | 5 anos | LGPD padrão |
| Events | 3 anos | 5 anos | Analytics histórico |
| Kivo Trading | 7 anos | 7 anos | Regulação CVM |
| Luminis | 5 anos | 5 anos | Consentimento assessments |

---

## L2 — Data Warehouse

### Responsabilidade
Transformar dados do lake em modelos analíticos por vertical, prontos para consulta e para treino de modelos.

### Modelos por Vertical

**Health (MaisVIDA)**
```
dim_municipio, dim_estabelecimento, dim_procedimento_sus
fact_atendimento, fact_indicador_idsus, fact_faturamento_sus
mart_risco_populacional, mart_otimizacao_repasse
```

**CRM / Conversacional (Plataforma)**
```
dim_lead, dim_campanha, dim_canal
fact_conversa, fact_conversao, fact_churn_event
mart_lead_scoring, mart_churn_prediction
```

**Eventos (Events)**
```
dim_evento, dim_participante, dim_palestrante
fact_checkin, fact_networking_match, fact_engajamento
mart_roi_evento, mart_perfil_audiencia
```

**Assessments (Luminis)**
```
dim_perfil_comportamental, dim_zona_genialidade
fact_assessment, fact_correlacao_performance
mart_genius_zone_insights
```

### Camadas de Transform
```
bronze/ — dados do lake, mínimo tratamento
silver/ — tipagem correta, deduplicação, FK resolvidas
gold/   — agregações, métricas de negócio, prontos para BI e AI
```

### Tecnologias
- **DuckDB** — analytics OLAP in-process, ideal para gold layer
- **ClickHouse** — time-series e event data (conversas, check-ins)
- **dbt** — transformações versionadas e testadas

---

## L3 — AI Engine

### Responsabilidade
Treinar, servir e monitorar modelos proprietários por vertical, sem expor dados brutos.

### Modelos Planejados por Vertical

**Health**
| Modelo | Tipo | Input | Output |
|--------|------|-------|--------|
| `risk-pop-v1` | Classificação | Histórico clínico anonimizado | Risco hospitalização 30 dias |
| `repasse-optimizer` | Regressão | Indicadores IDSUS atuais | Ações de maior impacto em repasse |
| `glosa-predictor` | Classificação | Procedimento + CID + estabelecimento | Probabilidade de glosa DATASUS |
| `ambient-doc-br` | NLP/ASR | Áudio consulta | Prontuário estruturado FHIR |

**CRM**
| Modelo | Tipo | Input | Output |
|--------|------|-------|--------|
| `lead-scorer` | Classificação | Comportamento conversacional | Score 0–100 de conversão |
| `churn-predictor` | Sobrevivência | Engagement signals | Probabilidade churn 30/60/90 dias |
| `best-next-action` | RL | Histórico de interações | Próxima ação recomendada |

### Federated Learning — Saúde

```
Município A (ambiente isolado)
  → treina update local do modelo
  → envia apenas gradientes (não dados)
    ↓
Cortex Aggregator
  → agrega gradientes de N municípios
  → gera modelo global melhorado
    ↓
Cada município recebe modelo atualizado
  → predições locais mais precisas
  → benchmark nacional disponível
```

**Framework:** Flower (flwr) — open-source, battle-tested em healthcare
**Garantia:** nenhum dado de paciente sai do ambiente do município em nenhuma etapa

### Ciclo de Vida dos Modelos
```
Experimentação (notebooks) → Validação clínica/regulatória → Staging → Produção → Monitoramento
         ↑                                                                              |
         └──────────────── Data drift detectado? Re-treino automático ←────────────────┘
```

### MLOps
- **MLflow** — tracking de experimentos, model registry, versionamento
- **Ray** — distributed training para modelos grandes
- **Evidently** — monitoramento de data drift e model performance
- **Seldon Core** — serving de modelos em produção

---

## Camada de Governança (cross-cutting)

Aplica em todas as camadas:

### Data Catalog
- Cada dataset documentado: owner, SLA, schema, lineage
- **OpenMetadata** — UI para exploração e discovery
- Tags automáticas de sensibilidade (PII, PHI, financial)

### Lineage End-to-End
```
Evento no produto → Ingestion → Lake → Transform → Warehouse → Modelo → Decisão
     ↑                                                                        |
     └─────────────────── Auditável em qualquer ponto ←──────────────────────┘
```

### Access Control
- Row-level security por tenant (cada produto vê apenas seus dados)
- Column-level masking para dados sensíveis
- Audit log imutável de todos os acessos

### LGPD Compliance
- Direito de acesso: API para retornar todos os dados de um titular
- Direito ao esquecimento: pipeline de deleção com propagação para lake + warehouse + modelos
- Consentimento: rastreado por evento, auditável

---

## API de Consumo — Produtos Elexia

Produtos não acessam o warehouse diretamente. Consomem via API:

```
GET  /v1/insights/{product}/{entity_id}     — insights por entidade
GET  /v1/scores/{model}/{entity_id}         — score de modelo específico
POST /v1/predictions/batch                  — predições em batch
GET  /v1/benchmarks/{vertical}/{metric}     — benchmarks anonimizados
POST /v1/events                             — ingestão de eventos (push)
```

Autenticação: API key por produto + mTLS para comunicação interna

---

## Topologia de Deployment

```
                    ┌─────────────────┐
                    │  Elexia Cortex  │
                    │   (on-premise   │
                    │   ou cloud BR)  │
                    └────────┬────────┘
                             │ API interna
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────┴──────┐   ┌───────┴──────┐   ┌──────┴──────┐
    │  Platform  │   │   MaisVIDA   │   │   Events    │
    │  (tenant)  │   │   (tenant)   │   │   (tenant)  │
    └────────────┘   └──────────────┘   └─────────────┘
```

**Premissa:** dados de saúde de municípios ficam no ambiente do município ou em servidor dedicado contratualmente isolado. O Cortex central recebe apenas gradientes de modelos federados.
