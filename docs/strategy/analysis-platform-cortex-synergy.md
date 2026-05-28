# Analise: Sinergia Elexia Platform + Cortex

**Data:** 28/Mai/2026
**Autor:** Cipher (analise de arquitetura e integracao)
**Status:** Analise concluida, aguardando decisao estrategica

---

## 1. Elexia Platform — Inventario de Capacidades

**Monorepo:** `/Users/wyndsonoliveira/code/elexia-platform`
**Apps:** api (Fastify), hub (Next.js — hub.elexia.com.br), web (Next.js — platform.elexia.com.br)
**~100 modelos Prisma | 32 modulos de API | PostgreSQL**

### Modulos por Dominio

| Dominio | Modulos API | Modelos-chave |
|---------|-------------|---------------|
| CRM nativo | crm-native, pipeline, contacts, companies | CrmContact, CrmCompany, CrmDeal, CrmActivity, CrmPipeline |
| Behavioral profiling | behavioral | BehavioralProfile (10 buyer avatars, BSQL score) |
| Lead scoring | lead-scoring | LeadScore, ScoringRule, ScoringModel |
| Aquisicao multicanal | acquisition | AcqCampaign (ads, organic, event, referral, radio, tv, outdoor, email, social) |
| Reativacao | reactivation | ReactivationScore (score, segment, factors, timeDecay) |
| Email marketing | email-marketing | EmailCampaign, EmailTemplate, segmentRules |
| CS Intelligence | cs-intelligence | churn.ts, health-score.ts, retention.ts |
| Data quality | data-quality | DedupMatch, CleaningOperation, DataQualityGate |
| Automacao | automation, crm-automation | AutomationFlow, FlowExecution |
| Integracoes | integrations, crm-adapters | HubSpot, RD Station, WTS + webhooks |
| Multicanal inbox | channels | Conversation, Message (WhatsApp, Instagram, Telegram, Webchat) |
| Voice/Calls | calls, voice-agents | Call, CallAnalysis, VoiceAgent |
| Content | content-studio, lp-builder | ContentDraft, LandingPage, BrandKit |
| Gamification | gamification, goals | Achievement, Leaderboard, UserStreak, Goal |
| AI | ai-engine, ai-copilot | AiAgent, AiConversation, AiGuardrail |
| Playbooks | playbooks | Playbook, PlaybookStep, PlaybookExecution |
| Pulse | pulse | WeeklyPulse |
| Scraping/Enrichment | lead-scraping | ScrapeJob, EnrichmentJob |

### Hub vs Web (apps separadas no mesmo monorepo)

- **hub.elexia.com.br** — Foco em vendas/operacional: pipeline, contacts, companies, calls, inbox, sales-dashboard, lead-reactivation, acquisition, ai-copilot
- **platform.elexia.com.br** — Foco em estrategia/gestao: jornada, scorecard, strategy-room, data-quality, lead-scoring, playbooks, goals, gamification, behavioral, pulse, reports, integrations

---

## 2. Jornada Universal do Cliente — O Metodo

**Epic 5 (EPIC-5) — "Alma da plataforma"**

### As 7 Fases

```
1. Atracao    (#34D399 verde)   — Trazer visitantes/leads
2. Captacao   (#22D3EE ciano)   — Converter visitante em lead
3. Qualificacao (#FBBF24 ambar) — Separar leads qualificados
4. Conversao  (cor propria)     — Fechar venda
5. Entrega    (cor propria)     — Entregar produto/servico
6. Retencao   (cor propria)     — Manter cliente ativo
7. Expansao   (cor propria)     — Upsell, cross-sell, referral
```

### Scorecard das 8 Fases (Story 5.1)
- Dashboard central com nota 0-100 por fase
- Cor reflete saude: vibrante (>70), desaturada (40-70), vermelho (<40)
- Tendencia 7/30 dias
- Near-real-time (< 5 min delay)

### Diagnosticos Automaticos (Story 5.2)
- Motor IA analisa metricas por fase
- Formato: "[Agente] diagnosticou: Sua fase X esta [forte/fraca] — [causa] — [acao]"
- Severidade: CRITICAL (<30), WARNING (30-50), OPPORTUNITY (50-70), STRONG (>70)

### Rastreamento de Transicoes (Story 5.3)
- Registro: contactId, fromPhase, toPhase, timestamp, triggeredBy
- Sankey diagram / funnel
- Tempo medio por fase

---

## 3. Platform = Operacional / Cortex = Inteligencia

| Capacidade | Quem faz | Por que |
|-----------|---------|--------|
| Gestao de contatos/deals | Platform | UI operacional, workflow diario |
| Disparo de email/WhatsApp | Platform | Integracao de canal ja feita |
| Visao 360 cross-system | Cortex | Precisa dados de FORA do CRM |
| Clustering/Segmentacao ML | Cortex | Volume + dados externos |
| Churn prediction profunda | Cortex | Dados financeiros + suporte + uso |
| Lead scoring operacional | Platform | Regras simples, execucao rapida |
| Lead scoring preditivo | Cortex | ML com dados de todas as fontes |
| Data quality CRM | Platform | Dedup dentro do CRM |
| Identity resolution cross | Cortex | Merge entre CRM + ERP + eventos |
| Automacao de fluxos | Platform | Motor de execucao ja existe |
| Governanca de dados | Cortex | Audit, tokenizacao, compliance |

---

## 4. Fluxos de Dados

### Platform -> Cortex (ingestao)
- Atividades CRM (deals, calls, emails, conversas) -> Customer 360
- Campanhas de aquisicao + resultados -> modelo de atribuicao
- Behavioral profiles (BSQL) -> enriquece perfil 360
- Data quality scores -> governanca do Cortex

### Cortex -> Platform (inteligencia)
- Churn score preditivo -> ReactivationScore
- Clusters de audiencia -> segmentRules das EmailCampaigns
- Next Best Action -> Playbook com acoes recomendadas
- Lead scoring enriquecido -> LeadScore com dados externos
- Anomaly detection -> alertas no WeeklyPulse

---

## 5. Conexao com Jornada Universal

A Jornada Universal (7 fases) e o FRAMEWORK DE ORGANIZACAO do Customer 360:

| Fase Jornada | Dados Platform | Dados Cortex (externos) | Insight Cortex |
|-------------|---------------|------------------------|----------------|
| Atracao | Acq campaigns, LP visits | Dados de eventos (Congressy), ads externos | Attribution multi-touch real |
| Captacao | Form submissions, scraping | Enrichment externo (CNPJ, LinkedIn) | Score de fit preditivo |
| Qualificacao | BSQL score, behavioral | Dados financeiros, credito | Score de qualificacao enriquecido |
| Conversao | Deals, pipeline stages | Historico de conversao cross-system | Win/loss prediction |
| Entrega | Activities, tasks | ERP delivery data | Delivery health score |
| Retencao | CS health, churn score | Suporte, NPS, uso real do produto | Churn prediction profunda |
| Expansao | Upsell pipeline, referrals | LTV cross-system, cluster de similares | Expansion revenue prediction |

---

## 6. Ideias de Integracao

### Ideia 1: Cortex como cerebro da Platform
Platform pergunta ao Cortex via API. Cortex responde com score + confianca. Platform executa.

### Ideia 2: Congressy -> Cortex -> Platform
Congressy DBs -> Cortex ingere, unifica, clusteriza -> Platform recebe como CrmContacts com tags -> Platform dispara campanha -> Resultados voltam pro Cortex (feedback loop)

### Ideia 3: Attribution Engine
Platform rastreia canais (AcqCampaign). Cortex calcula peso real de cada canal (multi-touch attribution com dados de TODAS as fontes).

### Ideia 4: Enrichment bidirectional
Platform enriquece Cortex com dados comportamentais. Cortex enriquece Platform com dados externos. CrmContact.customFields (JSON) recebe scores do Cortex.

### Ideia 5: Playbooks prescritos por IA
Cortex gera playbooks automaticamente baseado em clusters + scores. Platform executa via PlaybookExecution.

### Ideia 6: Platform como conector nativo Wave 1
Cortex conecta direto no PostgreSQL da Platform (conector generico PG) ou via API (ApiKey + WebhookEndpoint).
