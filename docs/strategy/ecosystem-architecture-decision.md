# Decisao de Arquitetura do Ecossistema Elexia

**Data:** 28/Mai/2026
**Participantes:** 3 especialistas (Estrategista de Plataforma, Enterprise Sales, Arquiteto de Plataforma)
**Pergunta central:** "Sao dois produtos ou UM com dois pontos de entrada?"
**Status:** Parecer entregue, aguardando decisao do founder

---

## Opcoes Avaliadas

### Opcao A: Dois Produtos Separados
- Cortex = produto standalone de dados/IA
- Platform = CRM/operacional standalone
- Integracao via API publica (mesmo nivel que HubSpot ou Salesforce)
- Branding e vendas separados

### Opcao B: Um Produto com Dois Pontos de Entrada
- Uma unica plataforma com UI operacional (Hub) e UI analitica (Cortex)
- Banco de dados compartilhado, deploy monolitico
- Mesmo contrato, mesmo tenant, mesma venda

### Opcao C: Plataforma Aberta com Core Proprietario (RECOMENDADA)
- Cortex = core aberto de dados + IA que aceita QUALQUER sistema (HubSpot, Salesforce, TOTVS, ERPs, etc.)
- Platform = cliente privilegiado com integracao mais profunda (CDC real-time vs batch, feedback loop bidirecional)
- Events = canal de aquisicao PLG
- Jornada Universal vive no Cortex (nao na Platform), aplicada a dados de QUALQUER fonte

---

## Voto do Conselho

**UNANIME: Opcao C — Plataforma Aberta com Core Proprietario**

---

## ESPECIALISTA 1: Estrategista de Plataforma

### Analise
- Opcao A desperdicaria a maior vantagem competitiva: a integracao nativa
- Opcao B limitaria o mercado — "quem ja tem CRM nao quer trocar, quer inteligencia"
- Opcao C permite land & expand: entra pelo Cortex (sem migracao), expande pra Platform

### Argumento central
"O Cortex deve ser o cerebro que QUALQUER corpo pode usar. A Platform e o corpo perfeito — mas nao o unico."

### GTM com Opcao C
1. **Land:** Cortex conecta no PostgreSQL/MySQL do prospect em 48h
2. **Expand:** Prospect ve o Customer 360 com Jornada Universal → quer mais
3. **Upsell:** Platform como "melhor cliente do Cortex" — CRM que ja vem integrado

### Risco mitigado
- Se o prospect ja tem Salesforce → Cortex conecta e agrega valor SEM exigir troca
- Se o prospect NAO tem CRM → Platform + Cortex como pacote integrado

---

## ESPECIALISTA 2: Enterprise Sales

### Analise
- Ciclo de venda de "troque seu CRM" = 12-18 meses com comite
- Ciclo de venda de "conecte seus dados e veja insights em 48h" = 2-4 semanas
- Opcao C reduz friccao de venda drasticamente

### Pricing com Opcao C
- Cortex standalone: R$4.990/mes (Professional) — low friction entry
- Platform + Cortex bundle: R$7.990/mes (desconto 20% vs comprar separado)
- Enterprise: custom — Cortex + Platform + dedicado

### Objecao antecipada
- "Se Cortex funciona com qualquer CRM, por que eu compraria a Platform?"
- Resposta: Platform tem integracao nativa (CDC real-time, Jornada Universal no CRM, automacoes pre-configuradas, playbooks prescritos por IA). Outros CRMs recebem batch. Platform recebe real-time.

### Diferencial competitivo da Platform como cliente
| Capacidade | Platform (nativa) | Outros CRMs (via Cortex) |
|-----------|-------------------|-------------------------|
| Sincronizacao | CDC real-time (<1min) | Batch (15-60 min) |
| Jornada Universal | Integrada na UI | Dashboard Cortex apenas |
| Automacoes por IA | Pre-configuradas | Manual setup |
| Feedback loop | Bidirecional automatico | Unidirecional (Cortex → CRM) |
| Playbooks prescritos | Sim, auto-gerados | Nao |

---

## ESPECIALISTA 3: Arquiteto de Plataforma

### Arquitetura Opcao C

```
                    CORTEX (Core Aberto)
                   /         |          \
           [Connectors]  [AI Engine]  [Jornada Universal]
          /    |    \        |              |
     HubSpot  SF  TOTVS  Preditivo    Customer 360
         \    |    /         |              |
          [Identity Resolution + PPRL]      |
                   \         |             /
                    [Semantic Layer - Cube.dev]
                           |
                    [Experience Layer]
                    /              \
            Cortex UI          APIs (qualquer cliente)
                                    |
                          Platform (cliente privilegiado)
                          /         |          \
                      Hub UI    Automacoes    Playbooks
```

### Principios arquiteturais
1. **Cortex NUNCA depende da Platform** — funciona standalone com qualquer fonte
2. **Platform SEMPRE depende do Cortex** — cerebro que alimenta decisoes
3. **Jornada Universal e propriedade do Cortex** — a Platform consome, nao define
4. **Conectores sao genericos** — PostgreSQL, MySQL, API REST, webhooks, CDC
5. **Platform tem conector privilegiado** — CDC nativo, schema pre-mapeado, zero config

### Jornada Universal como Camada Semantica do Cortex
- Cube.dev schema com JourneyPhase como dimensao primaria de TODOS os cubes
- Qualquer dado ingerido (de qualquer sistema) e mapeado para as 7 fases
- Platform ja tem o mapeamento nativo (PHASE_CONFIG)
- Outros sistemas: mapeamento configuravel pelo usuario no onboarding

### Integracao Platform ↔ Cortex
```
Platform → Cortex (ingestao privilegiada):
  - CDC real-time via Debezium/logical replication
  - Schema pre-mapeado (CrmContact → Customer, CrmDeal → Transaction, etc.)
  - Behavioral profiles (BSQL) → enriquecem Customer 360
  - Eventos de automacao → feedback loop

Cortex → Platform (inteligencia):
  - Churn score → ReactivationScore
  - Clusters → segmentRules de EmailCampaigns
  - Next Best Action → PlaybookExecution
  - Lead scoring enriquecido → LeadScore
  - Anomaly detection → WeeklyPulse
```

---

## Implicacoes para V1

### O que muda no Cortex V1 com Opcao C
1. **Conector PostgreSQL/MySQL generico e PRE-REQUISITO** — nao pode ser Wave 2
2. **Jornada Universal sai da Platform e entra no Cortex** como camada semantica primaria
3. **Onboarding mapeia fonte → fases da jornada** (nao so "conecte e veja dados")
4. **API publica do Cortex desde V1** — Platform consome via API, nao via banco compartilhado
5. **Identity Resolution funciona standalone** — nao precisa da Platform pra resolver identidades

### O que NAO muda
- Stack tecnica (Airbyte, dbt, ClickHouse, Cube.dev, MLflow)
- Seguranca (PPRL, tokenizacao, audit log, RBAC)
- Verticais (eventos, varejo, educacao, saude)
- Modelo de governanca LGPD

### Congressy como primeiro case (validado)
- Cortex ingere PostgreSQL da Congressy → Identity Resolution → Customer 360
- Jornada Universal aplicada a dados de eventos:
  - Inscricao = Captacao
  - Confirmacao = Conversao
  - Check-in = Entrega
  - Participacao em 2+ eventos = Retencao
  - Indicacao/organizacao = Expansao
- Demo mostra clustering, churn prediction, audience segments
- NAO precisa da Platform pra funcionar — valida Opcao C na pratica

---

## Consensos do Conselho (3/3)

1. **Opcao C e a unica que permite land & expand sem friccao**
2. **Jornada Universal DEVE viver no Cortex** — e o framework semantico que organiza dados de QUALQUER fonte
3. **Platform como "melhor cliente" cria diferencial real** — CDC real-time, automacoes, playbooks
4. **Conector generico PG/MySQL e existencial para V1** — sem ele, Cortex nao conecta em nada
5. **API-first desde V1** — Platform consome Cortex via API, nao via banco compartilhado
6. **Congressy valida a arquitetura** — case real de dados externos sem Platform

---

## Pergunta para o Founder

Com base na recomendacao unanime de Opcao C:

1. **Aceita Opcao C?** (Cortex aberto + Platform como cliente privilegiado)
2. **Jornada Universal migra pro Cortex?** (framework semantico universal, Platform consome)
3. **Conector PG/MySQL sobe pra V1?** (pre-requisito existencial identificado por todos)
4. **Prioridade de integracao:** Platform primeiro (cliente interno) ou externo primeiro (design partner)?
