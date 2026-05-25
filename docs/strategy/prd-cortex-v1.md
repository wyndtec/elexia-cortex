# Elexia Cortex — Product Requirements Document v1.0

**Data:** Maio 2026
**Status:** Aprovado — base para desenvolvimento e go-to-market
**Versão:** 1.0 — PRD fundacional
**Classificação:** Confidencial — uso interno e parceiros estratégicos

**Documentos de referência:**
- `docs/strategy/strategic-assessment-v1.md`
- `docs/strategy/gaps-research-pre-prd.md`
- `docs/strategy/security-architecture.md`
- `docs/strategy/council-session-full-vision.md`
- `docs/strategy/icp-personas-go-to-market.md`
- `docs/architecture/overview.md`

---

## SUMÁRIO EXECUTIVO

O Elexia Cortex é uma plataforma enterprise de dados e inteligência artificial que unifica todas as fontes de dados de uma organização — ERPs, CRMs, e-commerce, marketing, financeiro, suporte — em uma visão 360° do cliente e do negócio, com governança técnica de dados, inteligência preditiva proprietária e conformidade regulatória por design.

É vendido como programa de implantação enterprise (R$800k–R$3M) combinado com managed service recorrente (R$75k–R$250k/mês), frequentemente precedido pelo Diagnóstico de Governança Elexia (R$180k–R$400k) como abridor comercial.

**Posicionamento:** Palantir + SAP Data Intelligence para empresas brasileiras que faturam bilhões — sem a complexidade de um produto norte-americano e com os conectores certos para o ecossistema brasileiro.

---

## 1. PROBLEMA E OPORTUNIDADE

### 1.1 O problema central

Empresas de médio-grande porte possuem dados distribuídos em 6 a 15 sistemas diferentes que não se comunicam. O resultado operacional é:

- Relatórios gerados manualmente, demandando dias de trabalho de analistas
- Decisões tomadas com dados de semanas atrás, não de hoje
- Clientes que abandonam a empresa sem nenhum sinal prévio de alerta
- Dados pessoais de clientes armazenados sem controle, inventário ou proteção adequada
- Incapacidade de responder ao regulador (ANPD, BACEN, SUSEP) em 72 horas após um incidente
- Exposição regulatória não quantificada — a empresa não sabe o tamanho do risco que corre

### 1.2 A oportunidade de mercado

| Mercado | TAM | SAM (endereçável Ano 1–3) |
|---------|-----|--------------------------|
| Global Data Platform + AI | $57B (2026) → $180B (2030) | — |
| Brasil enterprise data + compliance | R$4.2B/ano | R$945M |
| EUA mid-market data platform | $12B/ano | $800M |

**Janela de entrada:** A LGPD está sendo ativamente aplicada pela ANPD (multas desde 2023). Empresas que faturam acima de R$100M já receberam notificações ou perderam contratos por falta de controles técnicos documentados. A janela de urgência é real e mensurável.

### 1.3 Por que o Cortex existe agora

O momento é definido por três forças convergentes:
1. **Regulação com dentes:** ANPD multando, BCB exigindo, clientes europeus exigindo DPA antes de assinar
2. **IA acessível:** LLMs e ML democratizaram o que antes exigia times de 50 cientistas de dados
3. **Stack open-source maduro:** Airbyte + DuckDB + dbt + Cube.dev + MLflow provam que não é necessário reinventar o motor — o diferencial é a integração e o empacotamento enterprise

---

## 2. VISÃO E PRINCÍPIOS

### 2.1 Visão do produto

> "Toda empresa que opera no Brasil e no mundo merece ver sua operação completa em tempo real, proteger os dados de seus clientes com o mesmo rigor de um banco suíço, e ter inteligência preditiva proprietária que nenhum concorrente pode copiar."

### 2.2 Missão

Ser a camada de dados e inteligência que conecta qualquer software ao negócio — transformando dados fragmentados em vantagem competitiva protegida.

### 2.3 Princípios não-negociáveis

| Princípio | O que significa na prática |
|-----------|---------------------------|
| **Dados nunca se movem sem necessidade** | O Data Fabric conecta onde os dados estão. Cópia só quando exigida pelo cliente |
| **Segurança por design, não por política** | Criptografia, tokenização e residência de dados são arquitetura — não configurações opcionais |
| **Previsibilidade financeira para o cliente** | Preço fixo mensal — sem surpresas de consumption billing |
| **Zero lock-in técnico** | BYOC, Terraform open, exportação de dados sem barreiras |
| **IA proprietária por cliente** | Modelos fine-tunados com dados do próprio cliente — não IA genérica |
| **Compliance como produto, não overhead** | Evidências forenses, audit trail e crypto-shredding são features vendáveis |

---

## 3. MERCADO-ALVO

### 3.1 ICPs prioritários

#### ICP 1 — Grande empresa brasileira com exposição internacional
- **Faturamento:** R$500M – R$5B
- **Setores:** Financeiro, Varejo, Indústria, Telecom, Agronegócio exportador
- **Dor principal:** LGPD + GDPR simultâneos sem controle técnico documentado
- **ERP típico:** SAP S/4HANA, TOTVS Protheus grande
- **TCV esperado Ano 1:** R$3M – R$6M
- **Trigger de entrada:** Multa de par no setor, exigência de DPA por cliente europeu, pergunta do conselho

#### ICP 2 — Empresa médio-grande sob pressão regulatória setorial
- **Faturamento:** R$100M – R$500M
- **Setores:** Financeiro (BCB), Seguros (SUSEP), Saúde privada (ANS), Pagamentos (BACEN)
- **Dor principal:** Regulador setorial ativo com exigências técnicas específicas
- **ERP típico:** TOTVS, Sankhya, Senior
- **TCV esperado Ano 1:** R$1.5M – R$3M
- **Trigger de entrada:** Auditoria externa revelando gaps, perda de contrato por falta de ISO 27001

#### ICP 3 — Holding / Grupo econômico com múltiplas subsidiárias
- **Faturamento consolidado:** R$2B+
- **Estrutura:** 3–15 subsidiárias com sistemas distintos
- **Dor principal:** Sem visão consolidada entre empresas do grupo; múltiplos reguladores simultâneos
- **TCV esperado Ano 1:** R$5M – R$15M
- **Trigger de entrada:** Exigência de investidor para IPO/captação, auditoria de M&A revelando gaps

### 3.2 Personas de compra

| Persona | Papel na compra | Dor principal | Mensagem que fecha |
|---------|----------------|---------------|--------------------|
| **CEO / Acionista** | Autoriza o investimento | Responsabilidade pessoal por incidente (LGPD Art. 42) | "Se acontecer um incidente hoje, você tem prova forense de que tomou todas as medidas adequadas" |
| **CFO** | Aprova o budget | Exposição fiscal/regulatória não quantificada | "R$2M de investimento previne R$21.5M de exposição" |
| **CIO** | Champion técnico | Sistemas que não se integram, time apagando incêndio | "Conecta SAP, TOTVS e HubSpot em dias. O CIO que trouxe isso é o herói da transformação digital" |
| **DPO / CISO** | Champion compliance | Incapacidade de responder ao regulador em 72h | "Audit log forense, crypto-shredding, inventário automático. Resposta para qualquer regulador em 24h" |
| **COO / VP Comercial** | Influenciador de negócio | Clientes saindo sem sinal de alerta | "30 dias antes de o cliente sair, o Cortex já sinalizou. Com a ação recomendada" |

---

## 4. ARQUITETURA DO PRODUTO

O Cortex é organizado em 4 camadas funcionais independentes mas interdependentes:

```
┌─────────────────────────────────────────────────────────────┐
│  L4 — SEMANTIC + EXPERIENCE LAYER                           │
│  Cube.dev Semantic Engine │ AI Chat │ Dashboards │ APIs      │
├─────────────────────────────────────────────────────────────┤
│  L3 — AI ENGINE                                             │
│  Modelos preditivos │ Fine-tuning │ Federated Learning       │
├─────────────────────────────────────────────────────────────┤
│  L2 — LAKEHOUSE / CUSTOMER 360                              │
│  Bronze/Silver/Gold │ dbt transforms │ Perfil 360°           │
├─────────────────────────────────────────────────────────────┤
│  L1 — DATA FABRIC                                           │
│  Airbyte engine │ 350+ conectores │ Schema Registry          │
├─────────────────────────────────────────────────────────────┤
│  CAMADA TRANSVERSAL — SEGURANÇA & GOVERNANÇA                │
│  KMS │ HSM │ DLP │ Forensics │ Audit Log │ RBAC/ABAC        │
└─────────────────────────────────────────────────────────────┘
```

### 4.1 L1 — Data Fabric (Conectores e Ingestão)

**Responsabilidade:** conectar qualquer fonte de dados ao Cortex sem mover dados desnecessariamente.

**Motor:** Airbyte (open-source, MIT license) embedded no Cortex
- 350+ conectores pré-construídos
- CDC (Change Data Capture) para sincronização em tempo real
- Schema registry para versionamento de contratos de dados
- Transformações mínimas na ingestão (Bronze layer = dado bruto)

**Estratégia de conectores — dois critérios de decisão:**

1. **API pública confiável + Airbyte maduro** → construir agora, sem dependência de parceiro
2. **Implementação variável por cliente** → construir com o primeiro cliente, junto ao parceiro especialista

---

**Wave 1A — Construir agora (API pública estável, Airbyte battle-tested):**

| Prioridade | Conector | Justificativa | Risco |
|-----------|---------|---------------|-------|
| P1 | HubSpot | API REST excelente, sandbox, versionada, Airbyte maduro | Muito baixo |
| P2 | Shopify | REST + GraphQL, zero variação entre lojas, sandbox | Muito baixo |
| P3 | Omie | API REST moderna, digital-first, PME BR crescendo — validação rápida de produto | Baixo |
| P4 | QuickBooks Online | REST, OAuth 2.0, sandbox disponível — dados financeiros EUA | Baixo |
| P5 | Salesforce | Bulk API + REST documentados; objetos padrão (Lead, Opportunity, Account) funcionam igual em toda instância | Médio (objetos custom variam por cliente) |

**Wave 1B — Construir com o primeiro cliente + parceiro especialista:**

| Conector | Por quê aguardar | Abordagem |
|---------|-----------------|-----------|
| TOTVS Protheus | Schema varia por versão (12.1, 12.1.33+) e por módulo customizado — o que funciona em uma empresa falha em outra | Parceiro TOTVS certificado mapeia os endpoints da instância + Elexia extrai o padrão para conector genérico |
| SAP S/4HANA / ECC | OData documentado mas implementações on-premise vs. cloud são produtos diferentes; autorização SAP é complexa | Parceiro SAP certified conduz a integração; Elexia padroniza após primeira implantação |

> **Demo environment:** enquanto Wave 1B não está pronto, o ambiente de demonstração usa dados sintéticos realistas por vertical (indústria, manufatura) — o cliente vê o destino antes de contratar.

---

**Wave 2 — 90 dias pós-lançamento:**
RD Station, Pipedrive, NetSuite, Google Sheets, PostgreSQL, MySQL direto

**Wave 3 — 6 meses:**
VTEX, Zendesk, WhatsApp (via Elexia Platform), Meta Ads, Google Ads, SAP B1

**Requisitos funcionais L1:**

- FR-L1-01: Conexão de nova fonte de dados via wizard no-code em menos de 5 minutos para conectores suportados
- FR-L1-02: Sincronização incremental (CDC) com latência configurável: tempo real (streaming), 5 min, 1h, 1 dia
- FR-L1-03: Schema registry versionado — breaking changes detectados e alertados antes de afetar downstream
- FR-L1-04: Retry automático com backoff exponencial em caso de falha de conexão
- FR-L1-05: Audit log de cada operação de ingestão: quem conectou, quando, quantos registros, hash dos dados
- FR-L1-06: Data lineage — rastreabilidade de cada campo desde a origem até o dashboard

### 4.2 L2 — Lakehouse / Customer 360

**Responsabilidade:** transformar dados brutos em perfil unificado de cliente e entidades de negócio.

**Stack:** DuckDB (análise local/small) + ClickHouse (warehouse analítico distributed) + dbt (transformações Bronze→Silver→Gold)

**Modelo de dados Customer 360:**

```
Entidade Central: Customer Profile
├── Identidade: name, CPF/CNPJ (tokenizado), email (tokenizado), telefone (tokenizado)
├── Jornada: timeline completa de interações (origem, compras, suporte, NPS)
├── Financeiro: LTV, ticket médio, frequência de compra, dias sem comprar
├── Comportamento: RFM score, segmento, propensão, churn score
├── Relacionamento: vendedor responsável, gestor de conta, status de contrato
└── Compliance: data de consentimento, base legal LGPD, histórico de direitos exercidos
```

**Modelos verticais incluídos no lançamento:**

| Vertical | Modelos | Entidades |
|---------|---------|-----------|
| CRM/Vendas | Pipeline health, deal velocity, forecast accuracy | Lead, Opportunity, Contact, Account |
| Varejo/E-commerce | Inventory turnover, basket analysis, repeat purchase | Product, Order, Cart, Return |
| SaaS B2B | Churn prediction, expansion revenue, health score | Subscription, Usage, License |
| Financeiro | Credit risk, payment behavior, default prediction | Transaction, Invoice, Payment |
| Eventos | Attendance pattern, LTV por evento, reativação | Event, Registration, Checkin |

**Requisitos funcionais L2:**

- FR-L2-01: Construção automática do perfil Customer 360 ao conectar 2 ou mais fontes com um identificador comum (email ou CPF/CNPJ)
- FR-L2-02: Identity resolution — matching de registros duplicados entre fontes usando algoritmos de similaridade + PPRL (Privacy-Preserving Record Linkage)
- FR-L2-03: Pipeline dbt gerenciado pelo Cortex — cliente não precisa escrever SQL para ter os modelos básicos funcionando
- FR-L2-04: Particionamento automático por tenant — dados de diferentes clientes nunca se misturam, mesmo em infraestrutura compartilhada
- FR-L2-05: Histórico completo preservado — soft delete, não hard delete; exclusão de dados via crypto-shredding (LGPD)
- FR-L2-06: Data freshness visível em cada métrica — usuário sempre sabe quando o dado foi atualizado pela última vez

### 4.3 L3 — AI Engine

**Responsabilidade:** gerar inteligência preditiva e prescritiva sobre os dados do cliente.

**Stack:** Python (scikit-learn, XGBoost, PyTorch) + MLflow (lifecycle) + Seldon Core (serving) + Flower (federated, para BYOC)

**Três níveis de IA:**

#### Nível 1 — IA Pronta (zero configuração, disponível no dia 1)
Modelos pré-treinados em datasets sectoriais brasileiros. Funciona imediatamente ao conectar os dados.

| Modelo | Output | Conector mínimo |
|--------|--------|-----------------|
| Churn Predictor | Score 0–100 + motivos principais | CRM + ERP |
| Next Best Action | Ação recomendada por cliente | CRM |
| Demand Forecast | Previsão de demanda 30/60/90 dias | ERP + E-commerce |
| Customer Health Score | Score de saúde do relacionamento | CRM + Suporte |
| Revenue Forecast | Previsão de receita por conta | CRM + Financeiro |
| Anomaly Detection | Alertas de comportamento anômalo | Qualquer fonte |

#### Nível 2 — IA Personalizada (fine-tuning com dados do próprio cliente)
Disponível a partir de 90 dias de dados históricos. O modelo aprende os padrões específicos do negócio do cliente — nenhum concorrente tem esse modelo.

- Fine-tuning supervisionado usando churn real histórico do cliente
- Retraining automático mensal com novos dados
- Feature importance explicável (por que o Cortex previu X)
- Comparativo de performance: modelo genérico vs. modelo fine-tunado

#### Nível 3 — IA Proprietária (federated learning, BYOC)
Para clientes que não podem enviar dados para fora de sua infraestrutura.

- Flower (flwr) framework: gradientes são compartilhados, nunca dados brutos
- O modelo melhora com contribuições agregadas sem expor dados individuais
- Exclusivo para tiers Enterprise + BYOC
- Aplicação primária: setores regulados (financeiro, saúde privada, seguros)

**Requisitos funcionais L3:**

- FR-L3-01: Modelos Nível 1 operacionais em menos de 24h após conexão dos dados
- FR-L3-02: Fine-tuning Nível 2 ativado automaticamente quando o dataset atingir mínimo de 1.000 eventos classificados
- FR-L3-03: Todas as predições acompanhadas de explicação (SHAP values ou equivalente) — não black box
- FR-L3-04: Versioning de modelos — possibilidade de rollback para versão anterior sem downtime
- FR-L3-05: A/B testing nativo entre versões de modelos com split configurável
- FR-L3-06: Federated Learning no modelo BYOC: apenas gradientes agregados saem da infra do cliente

### 4.4 L4 — Semantic Layer + Experience

**Responsabilidade:** expor os dados e a inteligência do Cortex de forma compreensível e consumível por qualquer perfil de usuário.

**Stack:** Cube.dev (semantic engine) + Hono.js (API layer) + React/TypeScript (frontend)

**Componentes do L4:**

#### Cortex Semantic Engine (powered by Cube.dev)
- Definições de métricas de negócio em TypeScript (uma vez, reutilizadas em todos os consumidores)
- APIs REST + GraphQL geradas automaticamente — qualquer frontend ou ferramenta de BI consome
- Pre-aggregations automáticas — queries em segundos mesmo com bilhões de registros
- Cache inteligente por tenant
- Pode ser brandado como "Cortex Semantic Engine" externamente

#### Cortex Intelligence (AI Chat)
- Interface em linguagem natural para consultar dados: "Quais clientes têm maior risco de churn no próximo mês?"
- Contexto do negócio injetado via Semantic Engine — respostas em terminologia do cliente
- Respostas com dados em tempo real, não dados de treinamento genérico
- Audit log de todas as perguntas e respostas (compliance)

#### Cortex Dashboards
- Dashboards pré-construídos por vertical (CRM, E-commerce, Financeiro, etc.)
- Customização drag-and-drop sem código
- Alertas configuráveis por threshold ou anomalia detectada pela IA
- Export controlado por RBAC (ver seção de segurança)

#### Cortex APIs (para integrações externas)
- REST API completa com autenticação OAuth 2.0 + JWT
- GraphQL para queries flexíveis
- Webhooks para eventos em tempo real (ex: cliente com churn score > 80%)
- SDK JavaScript/Python para integrações customizadas
- Rate limiting por tenant e por chave de API

**Requisitos funcionais L4:**

- FR-L4-01: Definição de métrica de negócio em menos de 10 linhas de TypeScript no Cube.dev
- FR-L4-02: API REST e GraphQL disponíveis para qualquer métrica sem engenharia adicional
- FR-L4-03: Cortex Intelligence responde em menos de 3 segundos para queries sobre dados do próprio tenant
- FR-L4-04: Dashboards pré-construídos operacionais imediatamente após conexão dos dados (Nível 1 de valor)
- FR-L4-05: Alertas entregues via email, Slack, webhook em menos de 5 minutos após trigger
- FR-L4-06: Todas as ações no L4 registradas no audit log forense

---

## 5. SEGURANÇA E PROTEÇÃO DE DADOS

### 5.1 Pirâmide de proteção criptográfica

O Cortex implementa 5 camadas independentes de proteção. Um atacante que supere uma camada ainda enfrenta as demais.

```
Nível 5 — Contexto e Invalidação Automática
Nível 4 — Hardware-Bound Keys (TPM/HSM/Attestation)
Nível 3 — Cruzamento Protegido (PPRL, SMPC, DP, TEE)
Nível 2 — Criptografia por Campo (Column-Level + Tokenização)
Nível 1 — Criptografia do Banco (TDE)
```

**Requisitos de segurança por nível:**

- FR-SEC-01 (N1): TDE ativo em todos os bancos, chave mestra no KMS (AWS KMS + HashiCorp Vault). Crypto-shredding em cancelamento de contrato: KEK deletado, dados matematicamente ilegíveis em menos de 60 segundos.
- FR-SEC-02 (N2): Tokenização de CPF, email, telefone via Vault de tokens separado. Pseudonimização de nome e endereço via Column DEK por tenant. AES-256 para dados financeiros.
- FR-SEC-03 (N3): PPRL para joins entre datasets — nunca pelo identificador real. Differential Privacy em agregações expostas a múltiplos usuários. TEE/Nitro Enclaves para cruzamentos de alta sensibilidade.
- FR-SEC-04 (N4): AWS CloudHSM (Managed) / Thales Luna (BYOC). Attestation obrigatória: hardware fingerprint + SO não adulterado + hash do executável Cortex + região geográfica + horário + contrato ativo — todos os critérios devem ser verdadeiros.
- FR-SEC-05 (N5): Política de contexto por tenant em YAML. Invalidação automática por: contrato encerrado, funcionário demitido (SCIM < 1 minuto), IP/país não autorizado, dado sendo movido entre regiões, adulteração detectada na aplicação.

### 5.2 DLP e Forensics

**Canary Records (armadilha ativa):**
- Registros fictícios com contatos únicos monitorados injetados em cada tenant
- Se o contato canary aparecer em uso externo: alerta em tempo real ao dono + log de quem baixou

**Watermark estatístico por usuário:**
- Cada usuário vê variações imperceptíveis nos valores (ex: LTV R$48.003 vs R$47.997)
- Análise matemática do dado vazado identifica a sessão de origem

**Watermark em documentos:**
- Visível: rodapé com usuário, data, hora, session ID
- Invisível: Unicode de largura zero entre campos, pixel pattern em PDFs
- Screen watermark: nome do usuário sempre visível em tela durante acesso a dados sensíveis

**UEBA (User and Entity Behavior Analytics):**
- Baseline de cada usuário: horário, volume, regiões acessadas
- Anomalia detectada → exportação pausada + admin notificado + sessão marcada + MFA requerido

**Audit Log Forense (imutável, hash-chained):**
- Cada evento: event_id, timestamp, user, ação, record_count, file_hash, watermark_id, previous_hash
- Hash-chain: adulteração de qualquer evento quebra toda a cadeia subsequente
- Pacote forense automático em incidente: extrato assinado digitalmente + hash do arquivo + watermark decode + canary log + timeline completa
- Admissível como prova digital: Marco Civil da Internet (Lei 12.965/14) + CPC

### 5.3 Data Governance — Controle de acesso

**RBAC + ABAC combinados:**

```
RBAC (por cargo):
  Owner → acesso total
  Admin → configura, não vê outras BUs
  Manager → sua equipe/região
  Analyst → consulta, export limitado
  Viewer → leitura, zero exportação

ABAC (por atributo do dado):
  Vendedor X → somente sua carteira de clientes
  Regional SP → somente estado = SP
  Financeiro → valores SEM PII
  Marketing → segmentos SEM indivíduos
```

**Controles de exportação:**

| Ação | Owner | Manager | Analyst | Viewer |
|------|-------|---------|---------|--------|
| Export < 100 registros | Sim | Sim | Sim | Não |
| Export < 10.000 | Sim | Com aprovação | Não | Não |
| Export > 10.000 | Sim | Não | Não | Não |
| Export com PII | Sim | MFA obrigatório | Não | Não |
| Export fora do horário | Sim | Justificativa | Bloqueado | Bloqueado |

**Requisitos de governance:**
- FR-GOV-01: Multi-tenancy rigoroso — queries sempre com filtro de tenant_id injetado automaticamente no nível do ORM, nunca dependendo de código de aplicação
- FR-GOV-02: Row-level security no banco de dados como segunda linha de defesa (além do filtro de aplicação)
- FR-GOV-03: Inventário automático de dados pessoais — mapa de onde cada campo PII está, desde qual sistema veio, com que base legal é processado
- FR-GOV-04: Direito ao esquecimento LGPD: solicitação de exclusão → crypto-shredding em < 60 segundos + confirmação com hash do KEK deletado
- FR-GOV-05: Relatório de compliance automático exportável para auditores (SOC 2, ISO 27001, ANPD)

---

## 6. CONFORMIDADE REGULATÓRIA

### 6.1 Modelo de responsabilidade compartilhada

```
CLIENTE = Controlador de Dados (LGPD Art. 5°, XVI)
  → responsável pela legalidade do processamento
  → assina o DPA com a Elexia
  → define finalidade e base legal

ELEXIA = Operador / Processador de Dados
  → processa somente por instrução do controlador
  → não usa dados para outros fins
  → responsabilidade definida e limitada pelo DPA
```

### 6.2 Documentos obrigatórios antes do primeiro cliente

| Documento | Cobre | Prazo |
|-----------|-------|-------|
| DPA (Data Processing Agreement) | GDPR Art. 28, LGPD Art. 39 | Antes do 1° cliente |
| SCCs (Standard Contractual Clauses) | Transferência internacional EU → BR/US | Antes do 1° cliente EU |
| Adendo CCPA (Service Provider Agreement) | Dados de California | Antes do 1° cliente US |
| Security White Paper | Descreve todos os controles técnicos | Antes do 1° cliente |
| Pentest Report (empresa independente) | Evidência técnica independente | Mês 2–3 |

### 6.3 Residência de dados por jurisdição

```yaml
tenant: "empresa-com-clientes-globais"
data_residency:
  - jurisdiction: BR → aws/sa-east-1 → compliance: LGPD
  - jurisdiction: EU → aws/eu-central-1 → compliance: GDPR
  - jurisdiction: US → aws/us-east-1 → compliance: CCPA/SOX
```

A geo-policy é aplicada no KMS: qualquer operação com dado de jurisdição BR em região fora de sa-east-1 é rejeitada automaticamente.

### 6.4 Roadmap de certificações

```
Lançamento (Q3 2026):
  → LGPD by architecture (por design, não por política)
  → DPA/SCCs/CCPA prontos para assinatura
  → Pentest report independente

Q1 2027 (entrada no mercado US):
  → SOC 2 Type I publicado
  → Vanta automatizando coleta de evidências

Q2 2027:
  → ISO 27001 iniciado (reconhecimento Brasil)

Q3 2027:
  → SOC 2 Type II publicado

Q4 2027:
  → ISO 27001 certificado

2028:
  → GDPR Art. 42 (EU) + setoriais por demanda (SOX, PCI-DSS, ISO 42001 para IA)
```

### 6.5 Padrões atendidos por design

| Padrão | O que cobre |
|--------|-------------|
| FIPS 140-3 Level 3 | HSM certificado |
| NIST SP 800-57 | Key management lifecycle |
| ISO/IEC 27040 | Storage encryption |
| LGPD Art. 46 + Art. 12 | Medidas técnicas + pseudonimização |
| GDPR Art. 32 | State-of-the-art encryption |
| BACEN Res. 4.893/2021 | AES-256 para dados financeiros |
| Marco Civil da Internet | Logs admissíveis como prova digital |

---

## 7. MODELOS DE IMPLANTAÇÃO

### 7.1 Managed (Elexia-hosted)

O Cortex roda na infraestrutura da Elexia. O cliente escolhe a região.

```
Região BR: AWS sa-east-1 (São Paulo) — compliance LGPD
Região US: AWS us-east-1 (Virginia) — compliance SOC 2 / CCPA
Região EU: AWS eu-central-1 (Frankfurt) — compliance GDPR [2027+]
```

- Elexia gerencia toda a infraestrutura, updates, monitoramento, SLA
- Clientes acessam via web app + APIs
- Dados ficam na região escolhida, nunca se movem para outra
- Indicado para: Starter, Growth, Scale, Enterprise sem restrição de infra

### 7.2 BYOC (Bring Your Own Cloud)

O Cortex roda na conta cloud do próprio cliente. A Elexia faz o deploy e gestão remota.

```
Cliente fornece: credenciais IAM (AWS) / Service Principal (Azure) / SA (GCP)
Elexia executa: terraform apply -var-file=client.tfvars
Resultado: Cortex operacional em 2–4 horas na conta do cliente
```

- Dados nunca saem da conta do cliente
- Chaves criptográficas no HSM do cliente (Thales Luna ou AWS CloudHSM próprio)
- TPM para hardware-binding (dado legível somente naquele hardware)
- Federated Learning disponível — apenas gradientes saem para modelos globais
- Elexia conecta via secure tunnel para gestão — sem acesso a dados
- Indicado para: financeiro, saúde privada, empresas com política de soberania de dados

**IaC suportado:**
```
cortex-byoc/
  terraform/
    aws/      # EKS, S3, RDS, KMS, CloudHSM
    azure/    # AKS, Blob, Cosmos, Key Vault
    gcp/      # GKE, GCS, BigQuery, Secret Manager
  helm/
    cortex/   # Charts Kubernetes cloud-agnostic
```

### 7.3 On-Premise

O Cortex roda no datacenter físico do cliente. Indicado para empresas com restrição regulatória ou política absoluta de não cloud.

- Deploy via Kubernetes + Helm charts
- Sem acesso remoto da Elexia (exceto sessões autorizadas de suporte)
- Modelo de suporte: SLA via ticketing + visitas técnicas programadas
- Updates: pacotes de atualização entregues manualmente
- Indicado para: government, bancário tradicional, defesa

---

## 8. INTEGRAÇÕES ELEXIA ECOSYSTEM

### 8.1 Elexia Governance → Cortex (fluxo principal de entrada)

O Governance é o diagnóstico; o Cortex é a implementação. Cada entrega do Governance alimenta diretamente o Cortex:

| Governance entrega | Cortex recebe e implementa |
|-------------------|---------------------------|
| Inventário de dados mapeado | Priorização de conectores Wave 1 |
| Gaps de compliance identificados | Controles técnicos configurados |
| Roadmap de certificações | Evidências automáticas de auditoria |
| DPA template | Logs forenses + audit trail |
| Análise de risco de vazamento | Watermarking + Canary records ativos |
| Relatório executivo de exposição | Dashboard executivo de compliance |

### 8.2 Elexia Platform

- Cortex recebe dados de comportamento de usuários da Elexia Platform
- Elexia Platform consome insights do Cortex para personalização
- Conector dedicado Wave 1 (junto com os 5 prioritários externos)

### 8.3 Elexia Events

- Dados de eventos (check-in, compras, engajamento) fluem para o Customer 360 do Cortex
- Modelos preditivos de comparecimento, reativação e LTV por evento disponíveis
- Conector dedicado Wave 1

---

## 9. REQUISITOS NÃO-FUNCIONAIS

### 9.1 Performance

| Métrica | Target | Crítico |
|---------|--------|---------|
| Query latência P50 (Semantic Layer) | < 500ms | < 1s |
| Query latência P99 | < 2s | < 5s |
| Cortex Intelligence resposta | < 3s | < 8s |
| Alerta de anomalia após detecção | < 5 min | < 15 min |
| Ingestão CDC latência | < 1 min | < 5 min |
| Crypto-shredding em cancelamento | < 60s | < 120s |
| Onboarding BYOC via Terraform | < 4h | < 8h |

### 9.2 Disponibilidade e SLA

| Tier | Uptime | Support | RTO | RPO |
|------|--------|---------|-----|-----|
| Starter / Growth | 99.5% | Business hours | 4h | 1h |
| Scale | 99.9% | 24/7 | 1h | 15 min |
| Enterprise / Strategic | 99.95% | 24/7 dedicated | 30 min | 5 min |

### 9.3 Escalabilidade

- Arquitetura multi-tenant desde o zero — sem refatoração futura necessária
- Isolamento por namespace Kubernetes por tenant (BYOC) ou por schema/partition (Managed)
- Horizontal scaling automático (Kubernetes HPA) por tenant independentemente
- Warehouse: ClickHouse cluster — escala de GB a PB sem mudança de arquitetura
- Airbyte: workers independentes por tenant — falha em um não afeta outros

### 9.4 Observabilidade

- Logs: estruturados em JSON, centralizados, retidos por 90 dias (Managed) / configurável (BYOC)
- Métricas: Prometheus + Grafana por tenant
- Tracing: OpenTelemetry distribuído (ingestão → transform → query)
- Alertas de SLA: PagerDuty ou Slack por criticidade
- Health check público por tenant em `/status`

### 9.5 Segurança (NFRs)

- TLS 1.3 obrigatório em todo transporte — TLS < 1.3 rejeitado pelo KMS
- Autenticação: OAuth 2.0 + OIDC (Okta, Azure AD, Google Workspace, SAML 2.0)
- MFA obrigatório para: Owner, qualquer export com PII, acesso fora do horário
- Pen test semestral por empresa independente
- Vulnerability scanning contínuo em imagens Docker (Trivy ou equivalente)
- SBOM (Software Bill of Materials) publicado por release
- Dependency updates automatizados com Dependabot + review obrigatório

---

## 10. MODELO COMERCIAL E PRECIFICAÇÃO

### 10.1 Jornada completa do cliente

```
PASSO 1 — DIAGNÓSTICO (Governance — R$180k–R$400k)
  6–8 semanas de consultoria
  Entrega: relatório de exposição + gaps + roadmap de certificações
  Decisão rápida (CEO/CFO) — ticket pequeno, urgência real

PASSO 2 — ARQUITETURA (incluso no diagnóstico expandido)
  Desenho técnico de como o Cortex implementa os controles identificados
  Validação técnica com CIO + CISO

PASSO 3 — IMPLANTAÇÃO (Cortex — R$800k–R$3M)
  8–16 semanas
  Entrega: plataforma operacional + conectores + Customer 360 + IA + segurança

PASSO 4 — CERTIFICAÇÃO (Governance conduz, Cortex sustenta — R$200k–R$500k)
  ISO 27001, SOC 2 — evidências geradas automaticamente pelo Cortex

PASSO 5 — MANAGED SERVICE (recorrente — R$75k–R$250k/mês)
  Plataforma + compliance contínuo + modelos IA atualizados + expansão
```

**TCV Ano 1:** R$3M – R$7M
**NRR esperado:** 135–145% (expansão por filiais, novas verticais, certificações adicionais)
**LTV médio por cliente:** R$8M – R$15M (horizonte de 5 anos)

### 10.2 Tabela de preços enterprise

| Tier | Componente | Valor |
|------|-----------|-------|
| **Diagnóstico de Governança** | 6–8 semanas, relatório completo | R$180k–R$400k |
| **Cortex Enterprise** | Implantação até 5 conectores, 1 sede | R$800k–R$1.5M |
| **Cortex Enterprise** | Managed Service | R$75k–R$120k/mês |
| **Cortex Strategic** | Multi-filial, BYOC, até 12 conectores | R$1.5M–R$3M |
| **Cortex Strategic** | Managed Service Premium + Retainer IA | R$150k–R$250k/mês |
| **Cortex Sovereign** | Holding/grupo — programa executivo | A partir de R$10M TCV |
| **Certificação** | ISO 27001 / SOC 2 — consultoria + evidências | R$200k–R$500k |

### 10.3 Tiers SaaS (para entrada digital / mid-market)

**Brasil (BRL/mês):**

| Tier | Preço | Limites |
|------|-------|---------|
| Free | Grátis | 1 conector, 50k registros, 3 usuários |
| Starter | R$1.990 | 3 conectores, 500k registros, 5 usuários |
| Growth | R$4.990 | 10 conectores, 5M registros, 20 usuários |
| Scale | R$9.990 | 25 conectores, 25M registros, ilimitado |
| Enterprise | Customizado (mín. R$20k/mês) | Ilimitado + BYOC + SLA + fine-tuning |

**EUA (USD/mês):**

| Tier | Preço | Limites |
|------|-------|---------|
| Free | Grátis | 1 connector, 50k records, 3 users |
| Starter | $499 | 3 connectors, 500k records, 5 users |
| Growth | $1.299 | 10 connectors, 5M records, 20 users |
| Scale | $2.499 | 25 connectors, 25M records, unlimited |
| Enterprise | Custom (min $5k/mês) | Unlimited + BYOC + SLA + fine-tuning |

---

## 11. ESTRUTURA DE TIME E ENTREGA

### 11.1 Time comercial

| Papel | Perfil | Remuneração |
|-------|--------|------------|
| Enterprise AE (2–3) | Ex-SAP/IBM/TOTVS — conhece ciclo enterprise | R$20k–R$35k base + 10–15% TCV |
| Solution Architect / Pre-Sales (1–2) | Dados + segurança + ERP | R$25k–R$40k + bônus por deal |
| Engagement Manager (1 por projeto) | Ex-Deloitte/KPMG | R$25k–R$45k |
| Governance Consultant (2–3) | DPO certificado + CISM | R$18k–R$30k |

### 11.2 Ciclo de vendas

| Etapa | Semanas | Atividade |
|-------|---------|-----------|
| Abertura executiva | 1–2 | Apresentação do risco setorial. Proposta do Diagnóstico |
| Diagnóstico Governance | 3–8 | Mapeamento + relatório de exposição. Introdução natural do Cortex |
| Arquitetura e validação | 9–12 | Design customizado. Demo com dados do cliente (se autorizado) |
| Fechamento | 12–16 | MSA + SOW + DPA assinados. Kickoff planejado |

**Com Governance como abridor:** 3–4 meses
**Sem abridor (venda direta):** 6–12 meses

### 11.3 Projeção de receita

| Período | Clientes | ARR |
|---------|---------|-----|
| Ano 1 (relações existentes) | 5–8 | R$4M–R$8M |
| Ano 2 (parceiros + inbound) | 15–20 | R$15M–R$25M |
| Ano 3 (escala + EUA) | 35–50 | R$40M–R$70M |

---

## 12. GTM — GO-TO-MARKET

### 12.1 Mercados e sequência

**Brasil (Ano 1–2):** Foco total até R$15M ARR. Relações existentes com C-levels de empresas que faturam bilhões. Metas: 5–8 clientes Ano 1, 15–20 Ano 2.

**EUA (Ano 1 em paralelo, escala Ano 2–3):** Não é V2 — empresas-alvo já têm clientes com GDPR/CCPA. GTM diferente: parceiros de sistema (Big 4 locais, SAP partners) antes de time próprio.

### 12.2 Canais de entrada

**Canal 1 — Relações existentes (maior velocidade):**
Acesso direto a C-level de empresas bilionárias via relações do fundador e rede Elexia. Abridor: briefing executivo de risco regulatório, não pitch de produto. Meta Ano 1: 5–8 clientes.

**Canal 2 — Parceiros de sistema (escala):**

| Parceiro | Modelo |
|----------|--------|
| Implantadores TOTVS certificados | Co-venda: 15–20% referral |
| SAP Certified Partners | Co-venda: 15% referral |
| Deloitte / KPMG / PwC Brasil | Co-venda ou white-label |
| Seguradoras cyber (Allianz, AIG) | Indicação mútua |
| Escritórios LGPD especializados | Indicação mútua |

**Canal 3 — Autoridade de mercado:**
- Relatório anual "Exposição de Dados nas 500 Maiores Empresas do Brasil"
- Presença em AMCHAM, LIDE, FIESP, Febraban, ABFintechs
- Parceria com ANPD como empresa de referência em compliance técnico

### 12.3 Demo framework (15 minutos)

| Minutos | Etapa | Conteúdo |
|---------|-------|----------|
| 0–2 | A Dor | Espelho: 5 sistemas sem integração, horas de planilha, nenhuma visão em tempo real |
| 2–5 | A Conexão | Demo ao vivo: conectar HubSpot ou Omie em menos de 3 minutos sem código (Wave 1A — API pública estável) |
| 5–9 | O AHA Moment | Customer 360: timeline completa de um cliente — origem, compras, suporte, NPS, risco |
| 9–12 | A Inteligência | Churn score + recomendação de ação. "A IA vai aprender os padrões do seu negócio" |
| 12–14 | A Segurança | Mapa de residência de dados: "Seus dados ficam no Brasil. LGPD by design" |
| 15 | Próximo passo | "Quer conectar o seu sistema agora? Em 10 minutos você vê seus próprios dados aqui" |

---

## 13. ROADMAP DE PRODUTO

### Fase 0 — Ambiente e Demo (Meses 1–3, Q3 2026)
**Objetivo:** ambiente completo e demonstrável para vender — conectores Wave 1A funcionando, dados sintéticos para verticais sem conector real

**L4 — Experience (prioridade máxima: é o que o cliente vê):**
- [ ] Cube.dev semantic engine configurado com métricas pré-definidas por vertical
- [ ] Dashboards pré-construídos: CRM/Vendas, Varejo/E-commerce, SaaS B2B, Financeiro
- [ ] Cortex Intelligence (AI Chat em linguagem natural) — Nível 1
- [ ] Ambiente de demo com dados sintéticos realistas por setor

**L3 — AI Engine Nível 1:**
- [ ] Churn predictor + health score + anomaly detection (modelos pré-treinados)
- [ ] Operacional com dados sintéticos de demo e com dados reais via Wave 1A

**L2 — Lakehouse / Customer 360:**
- [ ] Pipeline dbt Bronze/Silver/Gold funcional
- [ ] Modelo Customer 360 básico (identidade + jornada + financeiro + comportamento)
- [ ] Identity resolution por email e CPF/CNPJ

**L1 — Conectores Wave 1A (API pública confiável, Airbyte):**
- [ ] HubSpot — conector Airbyte configurado e testado
- [ ] Shopify — conector Airbyte configurado e testado
- [ ] Omie — conector Airbyte configurado e testado (cliente BR de validação rápida)
- [ ] QuickBooks Online — conector Airbyte configurado e testado
- [ ] Salesforce (objetos padrão: Lead, Opportunity, Contact, Account, Activity)

**Infraestrutura e compliance:**
- [ ] Segurança: TDE + tokenização PII + RBAC + audit log imutável
- [ ] Compliance: DPA/SCCs/CCPA prontos + Vanta ativo + controles SOC 2 básicos
- [ ] Deploy: Managed BR (sa-east-1) operacional

**Critério de saída:** ambiente de demo funcionando ao vivo com dados reais (HubSpot ou Omie), Customer 360 visível, IA Nível 1 gerando predições

---

### Fase 1 — Primeiros Clientes + Conectores Wave 1B (Meses 4–9, Q4 2026 – Q1 2027)
**Objetivo:** 5–8 clientes pagantes, ARR R$4M–R$8M, TOTVS e SAP funcionando com parceiros

- [ ] L1: TOTVS Protheus — com parceiro TOTVS certificado no primeiro cliente enterprise
- [ ] L1: SAP S/4HANA — com parceiro SAP no primeiro cliente SAP
- [ ] L1: Wave 2 (RD Station, Pipedrive, NetSuite, Google Sheets, PostgreSQL/MySQL)
- [ ] L3: IA Nível 2 — fine-tuning automático após 1.000 eventos do cliente
- [ ] L4: Cortex Intelligence evoluído — respostas com dados do próprio cliente
- [ ] Segurança: DLP completo (canary records + watermarking + UEBA)
- [ ] Compliance: SOC 2 Type I publicado + pentest report independente
- [ ] Deploy: BYOC AWS + Azure via Terraform modules
- [ ] Comercial: Time de AEs contratado + acordos formais com parceiros TOTVS/SAP

**Critério de saída:** 5 clientes pagantes, NPS > 50, churn < 5%

---

### Fase 2 — Escala Brasil + Entrada EUA (Meses 10–18, Q2 2027 – Q4 2027)
**Objetivo:** 15–20 clientes, ARR R$15M–R$25M, entrada US validada

- [ ] L1: Conectores Wave 3 (VTEX, Zendesk, Meta Ads, Google Ads, WhatsApp via Elexia Platform)
- [ ] L3: Federated Learning (BYOC) + modelos verticais avançados
- [ ] L4: White-label API para parceiros (Big 4, implantadores)
- [ ] Segurança: Pirâmide completa (HSM + TPM + attestation + TEE)
- [ ] Compliance: SOC 2 Type II + ISO 27001 iniciado
- [ ] Deploy: Managed US (us-east-1) operacional
- [ ] GTM: Primeiros 2–3 clientes US via parceiros SAP/Big 4

**Critério de saída:** ARR R$15M, NRR > 130%, pelo menos 2 clientes US em produção

### Fase 3 — Enterprise Global (Meses 19–36, 2028+)
**Objetivo:** ARR R$40M–R$70M, operação global consolidada

- [ ] Deploy: Managed EU (eu-central-1) operacional
- [ ] Compliance: ISO 27001 certificado + GDPR Art. 42 + setoriais (SOX, PCI-DSS, ISO 42001)
- [ ] Cortex Sovereign: programa para holdings e grupos econômicos
- [ ] Marketplace de modelos IA setoriais (compra/venda entre clientes — dados nunca expostos)
- [ ] GTM EUA: time próprio dedicado

---

## 14. MÉTRICAS DE SUCESSO

### Produto
| Métrica | Target 6 meses | Target 12 meses |
|---------|----------------|-----------------|
| Time-to-value (1° insight útil) | < 24h | < 2h |
| Conectores Wave 1 operacionais | 5/5 | 5/5 |
| Uptime Managed | 99.5% | 99.9% |
| NPS | > 40 | > 55 |
| Churn mensal | < 3% | < 2% |

### Comercial
| Métrica | Target Ano 1 | Target Ano 2 |
|---------|-------------|-------------|
| Clientes ativos | 5–8 | 15–20 |
| ARR | R$4M–R$8M | R$15M–R$25M |
| NRR | 120%+ | 135%+ |
| CAC payback | < 18 meses | < 12 meses |
| Win rate (demo → fechamento) | > 20% | > 30% |

### Segurança & Compliance
| Métrica | Target |
|---------|--------|
| Incidentes de vazamento de dados | 0 |
| Tempo de resposta a regulador | < 24h |
| Crypto-shredding em cancelamento | < 60s |
| Pentest sem críticos abertos | Semestral |
| SOC 2 Type I | Q1 2027 |

---

## 15. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| TOTVS bloqueia conector (política) | Média | Alto | Abordagem via API pública + parceria com implantadores certificados |
| Ciclo enterprise > 6 meses nos primeiros deals | Alta | Médio | Governance como abridor reduz para 3–4 meses; primeiros 3 clientes via relações diretas |
| Concorrente (Palantir, Snowflake) entra no Brasil com força | Baixa | Alto | Diferencial TOTVS + LGPD nativo + preço em BRL + Governance como ecossistema próprio |
| Equipe eng sub-dimensionada para Wave 1 | Alta | Alto | Usar Airbyte embedded — sem construir conectores do zero; foco eng em L2/L3/L4 |
| Certificação SOC 2 atrasada | Média | Médio | Pentest report + DPA/SCCs cobrem os primeiros 12 meses; Vanta acelera processo |
| Chave KMS/HSM comprometida | Muito Baixa | Crítico | N4 hardware-bound + attestation torna comprometimento fisicamente difícil |
| Regulação ANPD endurecida mid-flight | Média | Médio | Arquitetura by design — controles existem antes de serem obrigatórios |

---

## 16. DEPENDÊNCIAS E PRÉ-REQUISITOS

### Técnicas
- Airbyte: licença MIT confirmada para uso embedded em produto comercial
- Cube.dev: self-hosting validado para BYOC sem restrições de licença
- AWS CloudHSM: disponibilidade em sa-east-1 confirmada ($1.45/hora por cluster)
- Vanta: contrato assinado antes de Q4 2026 para SOC 2 Type I em Q1 2027

### Comerciais
- DPA/SCCs/CCPA: minutas prontas antes do primeiro cliente (external legal review)
- Security White Paper: disponível para due diligence do primeiro deal
- Pentest independente: agendado para meses 2–3 pós-lançamento

### Organizacionais
- Time de Engagement Managers: contratados antes de fechar o segundo cliente
- Governance consultants: 2 DPOs certificados na equipe para conduzir o diagnóstico

---

## 17. GLOSSÁRIO

| Termo | Definição |
|-------|-----------|
| **Customer 360** | Perfil unificado de um cliente construído a partir de todas as fontes de dados conectadas |
| **Data Fabric** | Camada que conecta fontes de dados onde estão, sem necessidade de mover ou copiar os dados |
| **TDE** | Transparent Data Encryption — criptografia do arquivo físico do banco de dados |
| **DEK/KEK** | Data Encryption Key / Key Encryption Key — padrão de chaves em camadas |
| **PPRL** | Privacy-Preserving Record Linkage — cruzamento de datasets por hash, nunca por PII real |
| **Differential Privacy** | Técnica que adiciona ruído estatístico controlado para evitar reconstrução de dados individuais |
| **TEE/Enclave** | Trusted Execution Environment — computação que nem o provedor cloud pode ver |
| **Federated Learning** | ML onde apenas gradientes são compartilhados — dados nunca saem da infra do cliente |
| **Crypto-shredding** | Exclusão criptográfica — deletar a chave de criptografia torna os dados permanentemente ilegíveis |
| **UEBA** | User and Entity Behavior Analytics — detecção de comportamento anômalo de usuários |
| **Canary Record** | Registro fictício com contato monitorado — usado para detectar vazamento de dados |
| **Watermark estatístico** | Variações imperceptíveis nos valores por usuário — permite rastrear a origem de um vazamento |
| **Attestation** | Processo pelo qual um servidor prova criptograficamente que é ele mesmo e não foi adulterado |
| **BYOC** | Bring Your Own Cloud — o Cortex roda na conta cloud do próprio cliente |
| **Semantic Layer** | Camada que define métricas de negócio uma vez e as disponibiliza via API para qualquer consumidor |
| **NRR** | Net Revenue Retention — expansão de receita em clientes existentes (acima de 100% = crescimento) |
| **TCV** | Total Contract Value — valor total do contrato considerando todos os anos |
| **DPA** | Data Processing Agreement — contrato que define os papéis de controlador e operador de dados |
| **SCCs** | Standard Contractual Clauses — cláusulas contratuais padrão para transferência internacional EU→BR/US |
