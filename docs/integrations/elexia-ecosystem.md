# Integrações — Ecossistema Elexia

Mapa de todos os produtos Elexia e seus contratos de integração com o Cortex.

---

## Padrão de Integração

Cada produto Elexia se conecta ao Cortex em duas direções:

```
PRODUTO → CORTEX (push de eventos)
  Webhook / Kafka producer → Ingestion Service
  Autenticação: mTLS + API key por produto

CORTEX → PRODUTO (pull de insights)
  REST API consumida pelo produto
  Autenticação: JWT com scope por produto
```

---

## Elexia Platform (CRM / WhatsApp)

**Repositório:** `/code/elexia-platform`
**Contato técnico:** a definir

### Eventos que o Platform envia ao Cortex
| Evento | Schema | Frequência |
|--------|--------|-----------|
| `lead.created` | lead_id, source, channel, timestamp | Real-time |
| `conversation.completed` | conv_id, duration, sentiment_score, outcome | Real-time |
| `deal.converted` | lead_id, value, product, time_to_close | Real-time |
| `churn.signal` | account_id, signal_type, severity | Real-time |

### Insights que o Platform consome do Cortex
| Endpoint | Modelo | Uso |
|----------|--------|-----|
| `GET /scores/lead-scorer/{lead_id}` | lead-scorer v1 | Score na abertura da conversa |
| `GET /scores/churn-predictor/{account_id}` | churn-predictor v1 | Dashboard CS |
| `GET /insights/best-next-action/{conv_id}` | best-next-action v1 | Sugestão para agente |

---

## MaisVIDA (Saúde Pública)

**Repositório:** `/code/cliente-elexia/maisvida-anderson`
**Contato técnico:** a definir
**Regime especial:** dados de saúde — isolamento de tenant obrigatório, federated learning apenas

### Eventos que o MaisVIDA envia ao Cortex
| Evento | Schema | Frequência |
|--------|--------|-----------|
| `atendimento.registrado` | estabelecimento_id, cid10, procedimento_sus, data | Diário |
| `indicador.calculado` | municipio_id, indicador_id, valor, meta, gap | Semanal |
| `faturamento.submetido` | competencia, tipo (BPA/AIH/APAC), valor, status | Mensal |

### Insights que o MaisVIDA consome do Cortex
| Endpoint | Modelo | Uso |
|----------|--------|-----|
| `GET /scores/repasse-optimizer/{municipio_id}` | repasse-optimizer v1 | Painel de gestão |
| `GET /scores/glosa-predictor/{procedimento}` | glosa-predictor v1 | Validação pré-envio |
| `GET /benchmarks/health/indicadores` | — | Comparativo nacional anonimizado |

**Nota:** Modelos de saúde são treinados localmente no ambiente do município via federated learning. O Cortex central recebe apenas gradientes agregados.

---

## Elexia Events

**Repositório:** `/code/elexia-events`
**Contato técnico:** a definir

### Eventos enviados ao Cortex
| Evento | Schema | Frequência |
|--------|--------|-----------|
| `checkin.realizado` | event_id, participant_id (hash), timestamp, session | Real-time |
| `networking.match` | event_id, match_score, interaction_duration | Real-time |
| `session.engajamento` | session_id, participants, avg_duration, dropout_rate | Por sessão |

### Insights consumidos
| Endpoint | Uso |
|----------|-----|
| `GET /insights/audience-profile/{event_id}` | Relatório pós-evento |
| `GET /scores/roi-evento/{event_id}` | Dashboard de organizador |

---

## Luminis (Assessments)

**Repositório:** `/code/luminis`
**Contato técnico:** a definir

### Eventos enviados ao Cortex
| Evento | Schema | Frequência |
|--------|--------|-----------|
| `assessment.completed` | user_id (hash), perfil_resultado, zona_genialidade | Por assessment |
| `performance.tracked` | user_id (hash), metric_type, value, period | Semanal |

### Insights consumidos
| Endpoint | Uso |
|----------|-----|
| `GET /insights/genius-zone-correlation/{profile_type}` | Insights pós-assessment |
| `GET /benchmarks/luminis/profiles` | Benchmarks de perfis por setor |

---

## Kivo Trading

**Repositório:** `/code/kivo-trading`
**Contato técnico:** a definir
**Regime especial:** dados financeiros — retenção 7 anos, CVM compliance

### Eventos enviados ao Cortex
| Evento | Schema | Frequência |
|--------|--------|-----------|
| `trade.executed` | instrument, direction, size, pnl, strategy_id | Real-time |
| `strategy.performance` | strategy_id, period, sharpe, drawdown, win_rate | Diário |

### Insights consumidos
| Endpoint | Uso |
|----------|-----|
| `GET /insights/market-patterns/{instrument}` | Input para estratégias |
| `GET /scores/risk-scoring/{portfolio_id}` | Gestão de risco |

---

## Elexia Uno (Freelancers)

**Repositório:** `/code/app-prestadores-servicos`
**Contato técnico:** a definir

### Eventos enviados ao Cortex
| Evento | Schema |
|--------|--------|
| `service.completed` | provider_id (hash), category, rating, value |
| `match.realizado` | provider_id (hash), client_segment, conversion |

### Insights consumidos
| Endpoint | Uso |
|----------|-----|
| `GET /scores/match-score/{provider_id}/{job_id}` | Motor de matching |
| `GET /insights/pricing-suggestion/{category}` | Sugestão de preço |

---

## Prioridade de Implementação

| Fase | Produtos | Justificativa |
|------|---------|---------------|
| Fase 1 | Platform + Events | Maior volume de dados, ROI rápido em lead scoring |
| Fase 2 | MaisVIDA | Maior complexidade, maior impacto social |
| Fase 3 | Luminis + Kivo | Verticais especializadas com dados únicos |
| Fase 4 | Elexia Uno | Menor criticidade inicial |

---

## Adicionando um Novo Produto

1. Abrir issue com template `integration-request.md`
2. Definir schema de eventos e endpoints necessários
3. Implementar producer em `/src/ingestion/{produto}/`
4. Adicionar consumer no produto em `/src/api/consumers/{produto}/`
5. Documentar aqui e no data catalog (OpenMetadata)
