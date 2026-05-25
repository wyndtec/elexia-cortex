# Elexia Cortex — Pesquisa de Gaps Pre-PRD

**Data:** Maio 2026
**Objetivo:** Resolver as 6 lacunas criticas do Strategic Assessment v1.0 antes da escrita do PRD
**Status:** Pesquisa concluida — decisoes documentadas

---

## GAP 1 — CONECTORES PRIORITARIOS

### Contexto da decisao
O Cortex precisa de conectores desde o dia 1 para entregar valor. A escolha errada dos primeiros 5 significa semanas de eng sem cliente usando. A escolha certa significa demo funcionando em < 2 semanas.

### Analise do mercado Brasil + EUA

**Brasil — ERPs por market share (2026)**

| ERP | Market Share Brasil | Segmento | Complexidade de integracao |
|-----|--------------------|---------|-----------------------------|
| TOTVS Protheus | ~38% | Mid-market, enterprise | Alta (API SOAP/REST hibrida) |
| SAP B1 / S/4HANA | ~22% | Enterprise | Alta (RFC + BAPI + OData) |
| Senior Sistemas | ~9% | RH + manufatura | Media (API REST) |
| Sankhya | ~8% | Mid-market | Media (API REST) |
| Omie | ~6% (crescendo rapido) | PME digital-first | Baixa (API REST moderna) |
| Conta Azul | ~5% | PME | Baixa (API REST moderna) |

**Brasil — CRMs por adocao**

| CRM | Adocao Brasil | Segmento | Complexidade |
|-----|--------------|---------|-------------|
| RD Station CRM | Lider mid-market | PME a mid | Baixa (API REST bem documentada) |
| HubSpot | Crescimento acelerado | Mid-market | Baixa (API excelente) |
| Salesforce | Dominante enterprise | Enterprise | Media (REST + SOAP + Bulk API) |
| Pipedrive | PME vendas | PME | Baixa (API REST moderna) |

**EUA — ERPs mid-market (foco inicial)**

| ERP | Market Share EUA mid-market | Complexidade |
|-----|-----------------------------|-------------|
| QuickBooks Online | ~29% PME | Baixa (API REST moderna) |
| NetSuite (Oracle) | ~20% mid-market | Media (SuiteScript + REST) |
| Microsoft Dynamics 365 BC | ~15% | Media (OData + Graph API) |
| Sage Intacct | ~8% | Media (XML-based API) |

**EUA — CRMs**

| CRM | Market Share EUA | Complexidade |
|-----|-----------------|-------------|
| Salesforce | ~23% | Media |
| HubSpot | ~20% crescendo | Baixa |
| Microsoft Dynamics CRM | ~17% | Media |
| Zoho CRM | ~8% | Baixa |

### DECISAO: Os 5 conectores de lancamento

**Criterio de selecao:** maximo de mercado coberto x minima complexidade de integracao x relevancia para os clientes Elexia existentes.

| Prioridade | Conector | Por que |
|-----------|---------|---------|
| P1 | HubSpot | API moderna, documentada, adocao rapida BR+US, cobre CRM + marketing + vendas |
| P2 | TOTVS Protheus | Nao-negociavel para Brazil enterprise. 38% market share. Nenhum concorrente faz bem |
| P3 | Salesforce | Standard global. Necessario para qualquer deal enterprise US e BR |
| P4 | Shopify | E-commerce: API excelente, global, cobre mid-market varejo nos dois mercados |
| P5 | QuickBooks / Omie | Dados financeiros sao criticos para Customer 360 real. QBO para EUA, Omie para BR PME |

**Conectores Wave 2 (90 dias pos-lancamento):**
- RD Station, Pipedrive, NetSuite, Google Sheets, PostgreSQL/MySQL

**Conectores Wave 3 (6 meses):**
- SAP B1, VTEX, Zendesk, WhatsApp (via Elexia Platform), Meta Ads, Google Ads

### Abordagem tecnica recomendada

NAO construir conectores do zero. Usar **Airbyte** como motor de conectores open-source:
- 350+ conectores pre-prontos (incluindo TODOS os 5 prioritarios)
- Licenca MIT — pode ser embutido no Cortex
- Contribuicao da Elexia para conectores brasileiros especificos (TOTVS, RD Station, Omie) cria goodwill na comunidade open-source
- Economiza 6-12 meses de eng de integracao

Stack recomendado:
```
Airbyte (motor de sync) --> Cortex Fabric (gerenciamento) --> L2 Warehouse
```

---

## GAP 2 — MODELO DE PRECIFICACAO

### Analise competitiva de pricing

| Concorrente | Modelo | Problema para o cliente |
|------------|--------|------------------------|
| Snowflake | Consumption-based (creditos) | Fatura imprevisivel. Clientes levam susto todo mes |
| Segment | Por MTU (Monthly Tracked User) | Explode com base de dados grande |
| Fivetran | Por linha sincronizada | Completamente imprevisivel |
| Databricks | Por DBU (compute unit) | Requer engenheiro para otimizar custo |
| HubSpot | Por contato + tier | Previsivel, mas caro em escala |

### O diferencial de pricing do Cortex

**Preco fixo mensal previsivel.** Este e o argumento de vendas mais forte contra todos os concorrentes acima.

> "Voce sabe exatamente quanto vai pagar todo mes. Sem surpresas."

### Estrutura de tiers recomendada

**BRASIL (precos em BRL/mes)**

| Tier | Preco | Limite | Para quem |
|------|-------|--------|-----------|
| Starter | R$ 1.990/mes | 3 conectores, 500k registros/mes, 5 usuarios | PME, primeiros clientes Elexia |
| Growth | R$ 4.990/mes | 10 conectores, 5M registros/mes, 20 usuarios | Mid-market crescendo |
| Scale | R$ 9.990/mes | 25 conectores, 25M registros/mes, usuarios ilimitados | Mid-market consolidado |
| Enterprise | Custom (min R$20k/mes) | Ilimitado + BYOC + SLA + fine-tuning | Enterprise, saude, financeiro |

**EUA (precos em USD/mes)**

| Tier | Preco | Limite | Para quem |
|------|-------|--------|-----------|
| Starter | $499/mes | 3 conectores, 500k records/mes, 5 users | SMB |
| Growth | $1.299/mes | 10 conectores, 5M records/mes, 20 users | Mid-market |
| Scale | $2.499/mes | 25 conectores, 25M records/mes, unlimited users | Growing mid-market |
| Enterprise | Custom (min $5k/mes) | Unlimited + BYOC + SLA + fine-tuning | Enterprise |

### Overage (acima do limite do tier)

- Registros adicionais: R$0,80 / 100k (BR) | $0,20 / 100k (US)
- Conectores adicionais: R$290/conector/mes (BR) | $75/conector/mes (US)
- Usuarios adicionais: R$190/usuario/mes (BR) | $50/usuario/mes (US)

### Add-ons (receita adicional)

| Add-on | Preco (BR) | Preco (US) |
|--------|-----------|-----------|
| IA Fine-tuning (Nivel 3) | R$4.990 setup + R$1.990/mes | $1.299 setup + $499/mes |
| BYOC (Bring Your Own Cloud) | + R$2.990/mes | + $749/mes |
| SLA 99.9% uptime garantido | Incluso Scale+ | Incluso Scale+ |
| Onboarding acelerado (2 dias) | R$4.990 unico | $1.249 unico |

### Estrategia de entrada: Freemium para viralizar

**Cortex Free (plano permanente gratuito):**
- 1 conector
- 50k registros/mes
- 3 usuarios
- Dashboard Customer 360 com 30 dias de historico
- Sem IA preditiva

Objetivo: cliente experimenta, ve valor, converte para Starter em 30-60 dias.
Benchmark: HubSpot Free → Starter tem conversao de ~15-20% em 90 dias.

---

## GAP 3 — SOC 2 TYPE II (EXIGENCIA EUA ENTERPRISE)

### O que e e por que importa

SOC 2 Type II e uma auditoria independente que certifica que a empresa tem controles de seguranca, disponibilidade e privacidade comprovados ao longo de um periodo minimo de 6 meses. Para qualquer deal B2B SaaS > $50k/ano nos EUA, e pergunta obrigatoria no processo de compra.

### Timeline realista

| Marco | Duracao | Custo estimado |
|-------|---------|---------------|
| Implementar controles e politicas | 2-3 meses | Interno (eng + legal) |
| SOC 2 Type I (snapshot) | +1 mes (auditoria) | $15k–$30k |
| Periodo de observacao Type II | 6 meses (operacao monitorada) | Interno |
| SOC 2 Type II (auditoria final) | +2 meses | $30k–$60k |
| **Total do zero ate Type II** | **~12-14 meses** | **~$50k–$100k** |

### Recomendacao: usar plataforma de automacao

Empresas que fazem SOC 2 sem automacao gastam 3x mais tempo e dinheiro. Recomendamos:

**Vanta** (preferencial para startups)
- Custo: ~$10k-15k/ano
- Automatiza coleta de evidencias (integra com AWS, GitHub, GSuite, etc.)
- Reduz o tempo de auditoria em ~60%
- Template de politicas prontas (150+ politicas pre-escritas)
- Usado por Brex, Plaid, Rippling na fase inicial

Alternativas: Drata (similar ao Vanta), Secureframe (mais barato, menos polished)

### Plano de certificacoes progressivas

```
Lancamento BR (Q3 2026)
  --> LGPD compliance por arquitetura (ja no design)
  --> ISO 27001 iniciado (reconhecido no Brasil)

EUA entrada (Q1 2027)
  --> SOC 2 Type I publicado
  --> CCPA compliance documentado

EUA escala (Q3 2027)
  --> SOC 2 Type II publicado
  --> Setoriais por demanda: SOX (financeiro), PCI-DSS (pagamentos)

Global (2028)
  --> GDPR DPA (Data Processing Agreement) padrao
  --> ISO 27001 certificado
```

### Controles criticos que precisam existir desde o dia 1

- Criptografia em transito (TLS 1.3) e em repouso (AES-256)
- Autenticacao multifator para todos os acessos ao sistema
- Log de auditoria imutavel de todos os acessos a dados
- Processo formal de gestao de incidentes
- Backup automatico com retencao documentada
- Politica de acesso minimo privilegio (RBAC)
- Processo de offboarding de funcionarios

---

## GAP 4 — SEMANTIC LAYER: ESCOLHA DE TECNOLOGIA

### O que e Semantic Layer e por que e o coracao do produto

A Semantic Layer e a camada que transforma o schema tecnico de banco de dados em conceitos de negocio reutilizaveis. Sem ela, cada dashboard precisa reescrever as mesmas metricas em SQL diferente, gerando inconsistencias e dependencia de analistas.

Com ela:
- "Receita Liquida" e definida uma vez → usada em todos os dashboards, queries, e na IA
- Qualquer gestor pergunta "Qual foi minha receita em marco?" sem escrever SQL
- A IA do Cortex tem o vocabulario do negocio do cliente

### Comparativo das opcoes

**Opcao A: Cube.dev (open-source)**

| Criterio | Avaliacao |
|---------|----------|
| Maturidade | Alta — 5+ anos, usado por Walmart, Airbnb, Uber |
| Stars GitHub | 18k+ (mai 2026) |
| Linguagem | TypeScript (alinha com stack Elexia) |
| APIs geradas | REST + GraphQL automaticamente |
| Pre-aggregations | Sim — otimizacao de performance automatica |
| Self-hosted | Sim — funciona em BYOC sem alteracoes |
| Licenca | MIT (core) + Apache 2.0 (pro features) |
| Custo cloud (se usarmos Cube Cloud) | $0-500/mes para escala inicial |
| Contras | Vendor risk se Cube.dev falir (mitigado pelo core open-source) |

**Opcao B: dbt Semantic Layer (MetricFlow)**

| Criterio | Avaliacao |
|---------|----------|
| Maturidade | Media — versao semantica e recente (2023+) |
| Integracao | Nativa com dbt (ja usamos dbt para transforms) |
| Linguagem | YAML + SQL (mais simples, menos flexivel) |
| APIs | Limitadas — precisa de BI tool em cima |
| Self-hosted | Sim |
| Licenca | Apache 2.0 |
| Contras | Menos maduro, requer dbt Cloud para features completas, menos API-first |

**Opcao C: Construir proprio**

| Criterio | Avaliacao |
|---------|----------|
| Flexibilidade | Maxima |
| Tempo | 12-18 meses para MVP competitivo |
| Custo eng | Alto (3-4 engenheiros dedicados) |
| Risco | Alto (reinventar roda ja bem construida) |
| Recomendacao | NAO para o momento atual |

### DECISAO RECOMENDADA: Cube.dev

Justificativa:
1. TypeScript-first alinha com stack Elexia (Hono.js, Node)
2. Gera REST + GraphQL automaticamente — qualquer frontend consome sem extra eng
3. Pre-aggregations resolvem performance sem config manual por cliente
4. Open-source core = zero lock-in, funciona em BYOC do cliente
5. Comunidade ativa com muitos conectores de datasources ja prontos
6. Pode ser branded como "Cortex Semantic Engine" externamente

Stack de integracao:
```
dbt (transforms Bronze/Silver/Gold) --> Cube.dev (semantic definitions) --> API REST/GraphQL --> L4 (dashboards + AI Chat)
```

---

## GAP 5 — DATA RESIDENCY POR REGIAO

### Requisitos regulatorios por mercado

| Mercado | Regulacao | Requisito de residencia |
|---------|----------|------------------------|
| Brasil | LGPD Art. 33 | Dados pessoais: transferencia internacional permitida com garantias. Dados de saude: preferencia por territorio brasileiro |
| EUA federal | Sem lei federal unica | Variavel por setor |
| California | CCPA | Nao exige residencia, mas exige transparencia de onde os dados estao |
| Healthcare EUA | HIPAA | Nao exige residencia US, mas exige BAA com o cloud provider |
| Financeiro EUA | SOX, SEC | Dados financeiros: EUA preferido por auditores |
| EU (futuro) | GDPR Art. 44-49 | Dados de EU residentes: devem ficar na EU (ou paises adequados) |

### Infraestrutura de regioes recomendada

**Regiao 1 — Sao Paulo (Elexia Managed BR)**
- Cloud: AWS sa-east-1 OU GCP southamerica-east1
- Para: todos os clientes brasileiros no modelo Managed
- Compliance: LGPD by design
- Custo estimado inicial: $3k-6k/mes (escala com clientes)
- Escolha AWS vs GCP: AWS tem presenca maior de enterprise no Brasil; GCP tem preco de egress menor

**Regiao 2 — Virginia EUA (Elexia Managed US)**
- Cloud: AWS us-east-1
- Para: clientes EUA no modelo Managed
- Compliance: SOC 2 (quando certificado), CCPA
- Custo estimado inicial: $2k-4k/mes

**Regiao 3 — Frankfurt (futuro EU)**
- Cloud: AWS eu-central-1
- Para: clientes europeus
- Compliance: GDPR
- Timeline: quando escalar para EU (2027+)

### Modelo BYOC — como funcionar em qualquer cloud

Usar **Terraform** como IaC (Infrastructure as Code) para abstrair a cloud:

```
cortex-byoc/
  terraform/
    aws/      -- modulos para AWS (EKS, S3, RDS, KMS)
    azure/    -- modulos para Azure (AKS, Blob, Cosmos, Key Vault)
    gcp/      -- modulos para GCP (GKE, GCS, BigQuery, Secret Manager)
  helm/
    cortex/   -- charts Kubernetes do Cortex (cloud-agnostic)
```

Fluxo de onboarding BYOC:
```
Cliente fornece: credenciais IAM (AWS) / Service Principal (Azure) / SA (GCP)
Elexia roda: terraform apply -var-file=client.tfvars
Resultado: Cortex rodando em 2-4 horas na conta do cliente
```

### Decisao de cloud primaria: AWS

Justificativa:
- Maior market share enterprise BR (60%+) e global (32%)
- Regiao Sao Paulo madura (sa-east-1, desde 2011)
- Airbyte tem integracao nativa com S3 (Data Lake)
- MLflow, Seldon Core: melhor suporte em EKS
- Custo: competitivo para o tamanho inicial

Multi-cloud no BYOC: suportar AWS + Azure + GCP por demanda de cliente, usando Terraform modules.

---

## GAP 6 — STORYTELLING DE VENDAS: DEMO 15 MINUTOS

### Framework da demo

O objetivo nao e mostrar features. E mostrar transformacao: antes e depois na vida do cliente.

**Estrutura dos 15 minutos:**

```
Minutos 0–2: A DOR (espelho do problema deles)
  - Mostrar: tela com 5 sistemas diferentes abertos ao mesmo tempo
  - Falar: "Hoje seu time passa [X horas/semana] cruzando dados entre sistemas.
    Nenhum deles fala com o outro. Voce nunca sabe, em tempo real, o que
    esta acontecendo com um cliente especifico do inicio ao fim."
  - Validar: "Isso ressoa com voce?"

Minutos 2–5: A CONEXAO (demo ao vivo — conectar um sistema)
  - Mostrar: wizard de conexao do HubSpot (ou TOTVS se for BR enterprise)
  - Tempo real: conectar em < 3 minutos ao vivo
  - Falar: "Isso e tudo que precisa. Sem codigo. Sem data engineer.
    Em menos tempo do que seu almoco, seu CRM esta sincronizado."

Minutos 5–9: O MOMENTO AHA (Customer 360 ao vivo)
  - Mostrar: buscar um cliente pelo nome
  - Revelar: timeline completa — primeira visita no site, lead no CRM,
    primeira compra no ERP, ticket de suporte, NPS preenchido, renovacao
  - Falar: "Esta e a jornada completa deste cliente. De onde veio,
    o que comprou, como se sente hoje, se vai renovar ou nao."
  - Pausa. Deixar o dado falar.

Minutos 9–12: A INTELIGENCIA (IA preditiva ao vivo)
  - Mostrar: lista de clientes com churn score > 75%
  - Mostrar: o que a IA recomenda como proxima acao para cada um
  - Falar: "A IA nao e ChatGPT generico. Ela foi treinada nos dados do
    seu setor e, apos 90 dias, vai aprender os padroes especificos
    do seu negocio. Nenhum concorrente seu vai ter esse modelo."

Minutos 12–14: A SEGURANCA (onde ficam os dados)
  - Mostrar: mapa de regioes de data residency
  - Falar: "Seus dados ficam no Brasil, em servidor que voce escolhe.
    A inteligencia e nossa. Os dados sao seus. LGPD by design,
    nao por politica."

Minuto 15: PROXIMO PASSO (sempre pedir algo concreto)
  - "Quer conectar o seu [HubSpot / TOTVS / sistema X] agora?
    Em 10 minutos voce ve seus proprios dados aqui."
  - Nao vender. Ativar.
```

### O que preparar antes de cada demo

- Ambiente de demo pre-carregado com dados ficticios do setor do prospect
- 1 caso de uso especifico do setor (ex: para saude, mostrar predicao de risco; para varejo, mostrar previsao de demanda)
- Saber antes: qual sistema eles mais usam (para conectar AO VIVO o sistema que eles reconhecem)

### Metricas de conversao esperadas (benchmark SaaS B2B)

| Etapa | Taxa esperada |
|-------|-------------|
| Lead qualificado → demo agendada | 30-40% |
| Demo realizada → trial ativado | 25-35% |
| Trial → Starter pago | 20-30% |
| Starter → Growth (expansao) | 15-25% em 6 meses |

---

## SINTESE DAS DECISOES

| Gap | Decisao tomada |
|-----|---------------|
| Conectores prioritarios | P1 HubSpot, P2 TOTVS, P3 Salesforce, P4 Shopify, P5 QuickBooks/Omie via Airbyte |
| Modelo de precificacao | Preco fixo mensal previsivel. Free → Starter → Growth → Scale → Enterprise |
| SOC 2 | Usar Vanta. SOC 2 Type I em Q2 2027, Type II em Q4 2027. LGPD desde lancamento |
| Semantic Layer | Cube.dev (open-source, TypeScript, REST+GraphQL, self-hostable) |
| Data residency | AWS primario. Regioes: sa-east-1 (BR) + us-east-1 (US). Terraform BYOC |
| Demo de vendas | Framework 15min: Dor → Conexao → AHA moment → IA → Seguranca → Proximo passo |

---

**Proximos passos:** Com estes gaps resolvidos, o PRD completo pode ser escrito com precisao.
Ver: `docs/strategy/prd-cortex-v1.md` (a ser criado)
