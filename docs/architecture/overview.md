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

### Retenção por Categoria
| Categoria de dado | Raw | Validated | Motivo |
|------------------|-----|-----------|--------|
| Dados financeiros / trading | 7 anos | 7 anos | Regulação CVM / SOX |
| Dados de CRM / conversacional | 5 anos | 5 anos | LGPD padrão |
| Dados de eventos / presença | 3 anos | 5 anos | Analytics histórico |
| Assessments / comportamental | 5 anos | 5 anos | Consentimento explícito |
| Dados de cliente externo | Configurável por cliente | Configurável | Contrato + LGPD/CCPA/GDPR |

---

## L2 — Data Warehouse

### Responsabilidade
Transformar dados do lake em modelos analíticos por vertical, prontos para consulta e para treino de modelos.

### Modelos por Vertical

**Customer 360 (cross-vertical — base para todos)**
```
dim_customer, dim_touchpoint, dim_channel, dim_source
fact_journey_event, fact_conversion, fact_churn_signal
mart_customer_360, mart_ltv_projection, mart_journey_timeline
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

**Assessments / Comportamental (Luminis)**
```
dim_perfil_comportamental, dim_zona_genialidade
fact_assessment, fact_correlacao_performance
mart_genius_zone_insights
```

**E-commerce / Varejo**
```
dim_produto, dim_categoria, dim_loja
fact_pedido, fact_devolucao, fact_carrinho_abandonado
mart_previsao_demanda, mart_recomendacao_produto
```

**Financeiro / Trading**
```
dim_ativo, dim_estrategia, dim_conta
fact_transacao, fact_posicao, fact_execucao
mart_risk_scoring, mart_performance_attribution
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

### Modelos Cross-Vertical (disponíveis para todos os clientes)

| Modelo | Tipo | Input | Output |
|--------|------|-------|--------|
| `churn-predictor` | Sobrevivência | Engagement signals + histórico | Probabilidade churn 30/60/90 dias |
| `lead-scorer` | Classificação | Comportamento + touchpoints | Score 0–100 de conversão |
| `best-next-action` | RL | Histórico de interações do cliente | Próxima ação recomendada |
| `ltv-projector` | Regressão | Histórico de compras + comportamento | LTV projetado 6/12/24 meses |
| `demand-forecaster` | Time-series | Histórico de vendas + sazonalidade | Previsão de demanda 30/90 dias |
| `sentiment-analyzer` | NLP | Conversas, tickets, reviews | Score de satisfação + alertas |

### Modelos por Vertical (fine-tuned no setor)

Cada vertical contratada recebe modelos pré-treinados no setor e depois fine-tuned nos dados do próprio cliente:

| Vertical | Modelos disponíveis |
|---------|-------------------|
| Varejo / E-commerce | Recomendação de produto, previsão de demanda, detecção de fraude |
| CRM / Vendas | Lead scoring, churn, best next action, win probability |
| Eventos | ROI por evento, perfil de audiência, previsão de presença |
| Financeiro / Trading | Risk scoring, anomaly detection, performance attribution |
| Assessments / RH | Predição de performance, correlação perfil → resultado |
| SaaS B2B | Health score, expansion revenue prediction, NPS predictor |

### Privacy-Preserving ML (clientes BYOC e dados sensíveis)

Para clientes no modelo BYOC onde dados não podem sair do ambiente próprio, o Cortex suporta treinamento federado: o modelo global melhora com os padrões de N clientes sem que dados individuais sejam expostos.

```
Cliente A (ambiente isolado)
  → treina update local do modelo
  → envia apenas gradientes (não dados)
    ↓
Cortex Aggregator
  → agrega gradientes de N clientes do mesmo setor
  → gera modelo global melhorado para aquela vertical
    ↓
Cada cliente recebe modelo atualizado
  → predições mais precisas com benchmark do setor
  → dados individuais nunca expostos
```

**Framework:** Flower (flwr) — open-source, production-ready
**Quando ativar:** clientes BYOC, setores regulados (financeiro, jurídico), dados contratuais sensíveis

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
