# Elexia Cortex — Strategic Assessment v1.0

**Data:** Maio 2026
**Status:** Aprovado — base para o PRD
**Autor:** Cipher (AIOS Master) + Wyndson Oliveira

---

## 1. REPOSICIONAMENTO DE VISAO

**O que era:**
> Infraestrutura de dados interna que alimenta os produtos Elexia.

**O que e agora:**
> Uma plataforma B2B de dados, IA e Customer Intelligence que qualquer empresa pode contratar — conecta todos os seus sistemas, unifica a jornada completa do cliente, e entrega IA proprietaria por vertical, com soberania de dados e gestao simplificada.

**Posicionamento:**
> "O Snowflake resolveu o armazenamento. O Segment resolveu o dado de marketing. O Cortex resolve o negocio inteiro — com IA que conhece o seu setor."

**Escopo global:** Internacional desde a concepcao. Brasil + EUA como mercados primarios. Sem fronteiras de idioma, moeda ou regulacao — compliance por arquitetura, nao por politica.

---

## 2. ARQUITETURA REVISADA — 4 CAMADAS

A arquitetura original (L1 Lake → L2 Warehouse → L3 AI) foi expandida com uma quarta camada essencial.

```
+-------------------------------------------------------------+
|  L4 — Semantic + Experience Layer                           |
|  Linguagem de negocio, dashboards, AI Chat, alertas         |
|  "O que esta acontecendo no meu negocio agora?"             |
+-------------------------------------------------------------+
|  L3 — AI Engine                                             |
|  Modelos proprietarios por vertical                         |
|  Federated learning — dados nunca expostos                  |
+-------------------------------------------------------------+
|  L2 — Data Warehouse / Lakehouse                            |
|  Customer 360 unificado + Journey completo                  |
|  Dados de ERP, CRM, e-commerce, mkt, ops — todos aqui      |
+-------------------------------------------------------------+
|  L1 — Data Fabric (nao Data Lake tradicional)               |
|  Dados ficam onde estao — conectados, nao movidos           |
|  +500 conectores: SAP, Salesforce, HubSpot, TOTVS, etc.    |
+-------------------------------------------------------------+
```

### Por que "Data Fabric" e nao "Data Lake"

| Data Lake tradicional | Data Fabric (Cortex) |
|----------------------|---------------------|
| Move dados para um lugar central | Conecta dados onde estao |
| Requer data engineer para mover | Self-service para time de negocio |
| Semanas para novo conector | Marketplace de conectores pre-prontos |
| Dados duplicados e custosos | Zero duplicacao desnecessaria |
| Lock-in: voce entrou, nao sai | Portable: dados continuam seus |

### L4 — Semantic Layer: o diferencial invisivel ao concorrente

A maioria dos concorrentes termina no L3 (modelos) ou nem chega la. A Semantic Layer e o que transforma dado tecnico em linguagem de negocio — sem SQL, sem data engineer, acessivel para qualquer gestor.

- Metricas de negocio definidas uma vez, usadas em todos os dashboards
- Natural language query: "Quais clientes compraram A mas nao compraram B?"
- Alertas automaticos baseados em logica de negocio
- Chat com dados proprietario (nao ChatGPT generico — IA que conhece o schema do cliente)

---

## 3. CUSTOMER 360 + JORNADA COMPLETA

### O problema atual do mercado

```
ERP (SAP/TOTVS) ------+
CRM (Salesforce/HubSpot)-+  SILOS SEPARADOS
WhatsApp/Atendimento ---+  Sem visao unificada
E-commerce ------------+  Time gasta semanas
Ads (Google/Meta) ------+  cruzando planilhas
```

### O que o Cortex entrega por cliente do cliente

```
Todos os sistemas --> Cortex Fabric --> Customer 360 unificado

Para cada cliente final, o Cortex sabe:
  - Quem e (perfil unificado de todas as fontes)
  - De onde veio (primeira interacao, canal de origem)
  - Toda a jornada (cada touchpoint, em ordem cronologica)
  - O que comprou / esta comprando (ERP + e-commerce)
  - Nivel de saude do relacionamento (NPS + engajamento)
  - Probabilidade de churn (modelo de IA)
  - Proxima acao recomendada (modelo de IA)
  - LTV projetado (modelo de IA por vertical)
```

### Fontes de dados conectadas

| Categoria | Exemplos |
|-----------|---------|
| ERP | SAP, TOTVS, Oracle, Protheus, Senior, NetSuite |
| CRM | Salesforce, HubSpot, Pipedrive, RD Station |
| E-commerce | VTEX, Shopify, WooCommerce, Magento, Nuvemshop |
| Atendimento | Zendesk, Intercom, Freshdesk, TALLOS |
| Marketing | Google Ads, Meta Ads, RD Station, Mailchimp |
| Financeiro | Conta Azul, Omie, QuickBooks, Stripe |
| Conversacional | Elexia Platform, Twilio, Take Blip |
| BI existente | Power BI, Tableau, Looker (como fonte) |
| Banco proprio | PostgreSQL, MySQL, MongoDB, Supabase |
| Planilhas | Google Sheets, Excel Online |

---

## 4. DIFERENCIAIS vs CONCORRENCIA

| Concorrente | O que faz bem | Falha critica | Cortex supera como |
|------------|--------------|--------------|-------------------|
| Snowflake | Data warehouse escalavel | Sem IA vertical, caro, lock-in cloud | Soberania + IA por vertical + preco |
| Databricks | ML platform poderosa | Requer time tecnico avancado | Self-service, sem data engineer |
| Segment (Twilio) | CDP de marketing | So dados de marketing, sem ERP/financeiro | 360 completo (ops + financeiro + mkt) |
| Power BI / Tableau | Visualizacao bonita | So visualizacao, zero IA preditiva | Insight + predicao + recomendacao de acao |
| SAP Analytics Cloud | Integra bem com SAP | SAP-only, extremamente caro | Multi-ERP, preco acessivel, IA |
| Fivetran / Airbyte | ETL robusto | So move dados, zero inteligencia | Fabric + IA em cima, nao so ETL |
| Mixpanel / Amplitude | Analytics de produto | So produto digital, sem offline/ERP | Omnichannel: online + offline + ERP |
| Metabase / Looker | BI auto-servico | Precisa de SQL, sem IA preditiva | Natural language query + predicoes |

### Posicao unica no mercado

> Nenhum player hoje combina: **Data Fabric + Customer 360 + IA vertical proprietaria + soberania de dados + self-service para negocio + preco acessivel para mid-market**. Esse e o espaco branco.

---

## 5. MODELO MULTICLOUD — SOBERANIA DE DADOS

### Tres modelos de hospedagem para o cliente escolher

**Modelo A — Elexia Managed**
- Dados processados e armazenados na infraestrutura Elexia
- Cliente escolhe regiao: BR (Sao Paulo), US (Virginia), EU (Frankfurt)
- Elexia garante: isolamento multi-tenant, LGPD/SOC2/GDPR
- Preco: menor (custo compartilhado de infra)
- Ideal para: PME, startups, quem nao tem equipe de infra

**Modelo B — Bring Your Own Cloud (BYOC)**
- Cortex roda no cloud do cliente (AWS, Azure, GCP, OCI)
- Dados NUNCA saem do ambiente do cliente
- Elexia gerencia o software, cliente gerencia a infra
- Preco: maior (instancias dedicadas)
- Ideal para: enterprise, saude, financeiro, governo

**Modelo C — On-Premise / Private Cloud**
- Cortex rodando no datacenter fisico do cliente
- Maxima soberania — zero dependencia de nuvem
- Elexia entrega conteineres + suporte + updates
- Preco: maior + setup fee
- Ideal para: orgaos publicos, defesa, saude critica, banco

### Principio fundamental

```
Cliente acessa: app.cortex.elexia.com
                    |
              (consultas seguras via API/mTLS)
                    |
             Dados no ambiente DELES
```

> A inteligencia e nossa. Os dados sao deles. Argumento de vendas inquebravel.

---

## 6. IA PROPRIETARIA — COMO OFERTAR

### Tres niveis de IA (progressivos)

**Nivel 1 — IA de Vertical (disponivel na contratacao)**
- Modelos ja treinados no setor do cliente, prontos no dia 1
- Exemplos varejo: previsao de demanda, churn por segmento, recomendacao de proxima compra
- Exemplos CRM/vendas: lead scoring, best next action, predicao de conversao, win probability
- Exemplos SaaS B2B: health score, expansion revenue prediction, NPS predictor
- Exemplos eventos: ROI por evento, perfil de audiencia, previsao de presenca
- Exemplos financeiro: risk scoring, anomaly detection, performance attribution

**Nivel 2 — IA de Benchmark Federado (melhora ao longo do tempo)**
- Todos os clientes do mesmo setor alimentam modelos globais via federated learning
- Dados individuais NUNCA expostos
- Cada cliente recebe modelo melhorado pelo coletivo
- Efeito de rede: quanto mais clientes, mais inteligente para todos

**Nivel 3 — IA Treinada nos Dados do Proprio Cliente (premium)**
- Apos 90 dias com dados do cliente: modelo fine-tuned nos padroes especificos deles
- Ninguem mais tem esse modelo — e exclusivo deles
- Posicionamento: "Seu concorrente tem IA generica. Voce tem IA que conhece sua empresa."
- Justifica pricing premium

### Tiers de produto

| Tier | Inclui | IA |
|------|--------|-----|
| Cortex Starter | Conectores + Dashboard 360 + Relatorios | IA basica de vertical (benchmarks publicos) |
| Cortex Growth | + Customer Journey + Predicoes | IA de benchmark federado do setor |
| Cortex Enterprise | + Modelo fine-tuned + BYOC + SLA | IA proprietaria exclusiva do cliente |

---

## 7. GESTAO SIMPLIFICADA

### Para o time Elexia (console multi-tenant)
- Visao de todos os clientes ativos
- Status de conectores (saude de cada pipeline em tempo real)
- Uso de recursos por cliente (custo operacional visivel)
- Alertas de anomalia de dados automaticos
- Deploy de modelos para grupo de clientes
- Billing e consumo por tenant
- Onboarding de novo cliente: < 4 horas (wizard + conectores pre-prontos)
- 1 engenheiro consegue gerenciar 50+ clientes ativos

### Para o cliente (portal self-service)
- Conectar novo sistema: wizard 10 minutos, sem codigo
- Ver jornada de qualquer cliente: busca por nome/CPF/email/empresa
- Dashboards estrategicos: prontos, sem SQL
- Criar alertas: "me avise quando churn score > 80%"
- Chat com dados: linguagem natural
- Exportar para qualquer ferramenta: BI, CRM, email

---

## 8. POSICIONAMENTO GLOBAL

### Por que Brasil + EUA primeiro

**Brasil:**
- LGPD criou dor enorme em todas as empresas — Cortex e a solucao LGPD-by-architecture
- Mid-market (R$10M–R$500M faturamento) subatendido por Snowflake/Databricks (caro + complexo)
- Forca de vendas Elexia ja existente como porta de entrada
- Verticais com dor aguda: saude publica, CRM/vendas, eventos, trading

**EUA:**
- Mercado 10x maior em volume e ticket medio
- CCPA + setoriais criam mesma dor de compliance que LGPD
- Aceleradoras brasileiras em SF/NY facilitam entrada
- Posicionamento de entrada: "Latinx Data Intelligence Company" para mercado hispano + diaspora brasileira

### Infraestrutura de internacionalizacao

| Requisito | Solucao |
|-----------|---------|
| Idioma | i18n nativo: PT-BR + EN + ES desde o dia 1 |
| Moeda | Billing em BRL, USD, EUR, MXN |
| Compliance | LGPD (BR) + CCPA (US) + GDPR (EU) — certificacoes progressivas |
| Latencia | Regioes: Sao Paulo + Virginia + Frankfurt |
| Suporte | Horarios BR + US com overlap |
| Contratos | Modelo adaptado por jurisdicao |

### Go-to-market alavancando forca de vendas Elexia

**Fase 1 — Brasil (Q3–Q4 2026)**
- Upsell para clientes Elexia Platform/Events existentes
- "Voce ja usa a Plataforma. O Cortex unifica tudo mais que voce usa."
- Verticais de entrada: CRM/Vendas, Varejo/E-commerce, SaaS B2B, Eventos, Financeiro
- Meta: 20 clientes pagantes, 3 verticais

**Fase 2 — Brasil expansao + EUA entrada (Q1–Q2 2027)**
- Parceiros: integradores SAP/TOTVS como canal B2B Brasil
- EUA: parceria com aceleradoras brasileiras, foco em empreendedores da diaspora
- Meta: 100 clientes BR, 10 clientes EUA

**Fase 3 — Global (2027+)**
- LATAM: Mexico, Colombia, Argentina
- Europa via GDPR compliance ja construido
- Meta: 500+ clientes, break-even operacional

---

## 9. SUSTENTABILIDADE E MODELO DE RECEITA

### Fontes de receita

| Fonte | Tipo | Margem estimada |
|-------|------|----------------|
| Subscription mensal (tiers) | Recorrente | 70–80% |
| Overage de dados (volume) | Variavel | 50% |
| IA Enterprise (fine-tuning) | Setup + recorrente | 85% |
| Implementacao/onboarding | Unico | 30% |
| Marketplace de conectores premium | Transacional | 90% |

### O efeito de rede que garante sustentabilidade

```
Mais clientes por vertical
  --> Mais dados federados
    --> Modelos de IA melhores
      --> Mais valor para todos os clientes
        --> Mais dificil de substituir (lock-in positivo)
          --> Mais clientes novos por recomendacao
```

---

## 10. LACUNAS CRITICAS (pre-PRD)

Estas lacunas precisam ser resolvidas com pesquisa antes da escrita do PRD.
Ver documento: `docs/strategy/gaps-research-pre-prd.md`

| Lacuna | Urgencia | Impacto |
|--------|---------|---------|
| 5 conectores prioritarios (quais ERPs/CRMs primeiro) | Alta | Sem conector = sem valor |
| Modelo de precificacao validado | Alta | Sem pricing = sem venda |
| SOC 2 Type II (exigencia EUA enterprise) | Media | Bloqueia deals grandes |
| Semantic Layer: tecnologia (Cube.dev vs proprio) | Alta | Coracao do produto |
| Data residency por regiao (AWS SP + Virginia) | Alta | Sem isso = sem BYOC |
| Storytelling de vendas: demo 15min | Alta | Vendedor precisa disso |

---

## SINTESE — O CORTEX EM UMA FRASE

> "Elexia Cortex e a plataforma de dados e IA que unifica toda a informacao do seu negocio — de qualquer sistema, em qualquer cloud — e entrega inteligencia proprietaria sobre cada cliente, com soberania total dos seus dados."
