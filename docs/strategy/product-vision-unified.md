# Elexia — Visao de Produto Unificado

**Data:** 26/Jun/2026
**Origem:** Sessao estrategica Founder + Cipher
**Status:** Documento vivo — captura da visao do produto unificado (Cortex + Platform + Oitavo Dia)

---

## 1. O QUE E

Elexia e a camada que falta entre o caos de dados e a decisao estrategica, organizada pela Jornada Universal do Cliente.

> "Conecta seus sistemas, unifica seus dados, e mostra — em numeros concretos — onde sua jornada do cliente esta vazando, onde esta forte, e o que fazer agora."

**Nao e CRM.** CRM a empresa ja tem (e provavelmente odeia).
**Nao e BI.** Dashboard todo mundo tem. Ninguem olha.
**Nao e data warehouse.** Infraestrutura nao resolve problema de gestao.

E **visibilidade sobre o dinheiro que escorre entre os dedos todos os dias** — com o numero exato e a acao para tampar.

---

## 2. O PROBLEMA QUE RESOLVE

### 2.1 Dores universais (encontradas em 700+ projetos)

| Dor | Como o produto resolve |
|-----|----------------------|
| 5-15 sistemas que nao conversam | Conectores nativos (Omie, RD, TOTVS, HubSpot, Hotmart, Kiwify) — integra tudo |
| Dados espalhados, duplicados, sujos | Identity Resolution — unifica pessoa/empresa cross-system |
| "Temos dados mas nao sabemos o que fazer" | Scorecard da Jornada Universal — nota por fase, diagnostico automatico |
| Buracos no balde (leads que somem, clientes que churnam) | Detector de vazamento multicanal — telefone, WhatsApp, DM, email, forms, eventos |
| "Nao sei por qual canal investir" | Attribution multi-touch + ROI real por canal de growth |
| Operacao reativa, apagando incendio | IA prescritiva — "[Fase X] critica porque [causa]. Acao: [Y]" |
| Governanca zero sobre dados | Audit trail, tokenizacao, controle de acesso por papel |
| Todos os leads tratados igual | Perfilamento comportamental — 10 avatares de compra, abordagem adaptada |
| Nao sabe o potencial de compra do cliente | Scoring preditivo + enriquecimento de dados (CNPJ, credito, judicial) |

### 2.2 Por que ninguem resolve hoje

| Razao | Consequencia |
|-------|-------------|
| Sao 5-15 sistemas diferentes | Ninguem quer integrar tudo na mao |
| Cada canal tem sua API, formato, login | O gestor desiste no terceiro sistema |
| Os dados estao sujos, duplicados, incompletos | "Joao Silva" no CRM e "J. Silva" no ERP e "joao@gmail" no WhatsApp |
| Ninguem sabe o que medir | "Temos 300 metricas e zero decisao" |
| Requer disciplina operacional continua | Funciona 2 semanas, depois abandona |
| As ferramentas existentes resolvem UMA parte | HubSpot faz CRM. GA faz analytics. Ninguem faz o LOOP |

---

## 3. AS 5 ENTREGAS DE VALOR

### 3.1 CONECTAR — "Seus sistemas agora conversam"
- Conectores nativos para sistemas brasileiros e globais
- Identity Resolution cross-system (PPRL, Bloom Filters)
- Data quality automatica (dedup, limpeza, validacao)
- UTM Manager centralizado + pixel checker
- Tagueamento automatico de leads por canal de origem

### 3.2 ENXERGAR — "Sua jornada tem numeros reais"
- Scorecard da Jornada Universal (7 fases, nota 0-100 por fase)
- Detector de vazamento por canal (telefone, WhatsApp, DM, email, forms, eventos)
- Funil com taxas de conversao e tempo medio por fase
- Dashboard de Growth Channels (CAC real, ROAS, LTV por canal)
- Estimativa de receita perdida em reais por mes

### 3.3 CONHECER — "Voce sabe quem e cada cliente"
- Perfilamento comportamental (10 avatares de compra — Behavioral Selling Framework)
- 7 dimensoes do perfil de compra (Personalidade, Processo de Decisao, Nivel de Consciencia, Autoconfianca, Motivacao, Engajamento, Bloqueios)
- BSQL Score (Behavioral Selling Qualification Level) — substitui BANT
- Segmentacao por avatar × produto × oferta
- Enriquecimento de dados (CNPJ/CPF, credito, judicial, redes sociais)
- Potencial de compra e capacidade de expansao por cliente

### 3.4 AGIR — "Voce sabe o que fazer agora"
- Diagnostico automatico por IA (causa + acao por fase)
- Playbooks prescritos baseados em perfil comportamental + dados
- Recomendacao de copy e abordagem por avatar de compra
- Alertas de vazamento em tempo real
- Investment Advisor — onde investir/cortar por canal com base em cohort real

### 3.5 CRESCER — "Voce encontra os caminhos de growth"
- Analise de cohort por data de criacao do lead × canal × tempo de conversao
- Identificacao de canais com curva longa mas alta conversao (YouTube, eventos, SEO)
- Programa de indicacao com tracking integrado
- Upsell/cross-sell scoring — quem pode comprar mais e o que
- Descoberta de interesses por tipo de conteudo/produto consumido

---

## 4. DETECTOR DE VAZAMENTO MULTICANAL

### O "Balde Furado" — cobranca real por canal

| Canal | O que vaza | Como detecta | O que mostra |
|-------|-----------|-------------|-------------|
| Telefone | Chamadas nao atendidas | Integracao PABX/VoIP — log de chamadas perdidas | "37 chamadas perdidas esta semana. R$12K em oportunidades" |
| WhatsApp | Mensagens sem resposta | API WhatsApp Business — recebidas vs respondidas | "23 leads esperando +4h. Tempo medio resposta: 6h12" |
| Instagram DM | DMs ignoradas | API Instagram — mensagens nao lidas | "15 DMs sem resposta. 8 de campanhas pagas (R$340 jogados fora)" |
| Messenger | Mensagens abandonadas | API Meta — conversas sem followup | "9 conversas morreram sem resposta" |
| Email | Emails sem reply | IMAP/SMTP — tempo de resposta | "Tempo medio de resposta: 2 dias. Benchmark: 4h" |
| Forms do site | Formularios sem contato | Webhook form -> CRM — lead sem atividade | "42 leads do site nunca contatados. 18 ha +7 dias" |
| Eventos | Participantes sem follow-up | Congressy/Sympla -> lista vs CRM | "200 no evento, 34 contatados. 166 desperdicadas" |
| Indicacao | Referral sem tracking | Mencao sem rastreio formal | "Voce nao sabe quantos vieram por indicacao" |

### Visualizacao por fase da Jornada

```
FASE: CAPTACAO — Score: 42/100 (CRITICO)

  Canais ativos: 6
  WhatsApp    52% respondido   <- 48% VAZANDO
  Telefone    23% atendido     <- 77% VAZANDO
  Instagram   68% respondido
  Email       41% respondido   <- 59% VAZANDO
  Forms Site  12% contatado    <- 88% VAZANDO
  Eventos      8% follow-up    <- 92% VAZANDO

  Estimativa de perda: R$47.200/mes
```

---

## 5. ATRIBUICAO E GROWTH CHANNELS

### 5.1 Gestao de UTMs centralizada
- Gerador, validador e rastreador de UTMs
- Alerta quando leads entram sem UTM (canal nao identificado)
- Alerta quando LP nao tem pixel configurado
- Deteccao de UTMs duplicados/conflitantes

### 5.2 Tagueamento automatico
| Ponto de entrada | Como identifica | Tag automatica |
|-----------------|----------------|---------------|
| Link com UTM | Parser de URL | source, medium, campaign, content, term |
| WhatsApp (numero dedicado) | Numero -> canal | whatsapp-inbound + numero |
| Instagram DM | API Meta | instagram-dm + post/story de origem |
| Formulario do site | Hidden fields + referrer | UTM + pagina de origem |
| Evento presencial | QR code unico | evento-{nome} + data |
| Indicacao | Link personalizado | referral-{nome} + comissao |
| Ligacao telefonica | Numero virtual por canal | phone-{canal} via PABX |

### 5.3 Analise de cohort por tempo de conversao

Agrupa leads por data de criacao x canal x status ao longo do tempo.

Insight-chave: **canais com curva longa (YouTube, eventos, SEO) parecem ruins em 7 dias mas sao os melhores em 90 dias. Quem olha so o curto prazo mata os melhores canais.**

### 5.4 Dashboard de decisao de investimento

Metricas por canal:
- CAC real (custo por aquisicao efetiva, nao por clique)
- Taxa de conversao em 7, 30, 60, 90 dias
- LTV medio por canal
- LTV/CAC ratio
- Veredicto: ESCALAR / MANTER / OTIMIZAR / REVISAR / PAUSAR

### 5.5 Investment Advisor (IA)

Recomendacao automatica de alocacao de budget baseada em dados reais:
- Onde investir mais (canais com alto LTV/CAC)
- Onde cortar (canais com CAC crescente e LTV declinante)
- O que criar (programas de indicacao, volume de conteudo organico)
- O que consertar (o canal nao e ruim, o follow-up e que falha)

---

## 6. INTELIGENCIA COMPORTAMENTAL

### 6.1 Perfilamento de Compra (Behavioral Selling Framework v2.0)

Fundamentacao: Big Five (Costa & McCrae, 1992) + Behavioral Economics (Kahneman, Thaler, Fogg) + RFM (Hughes, 1994) + Awareness Stages (Schwartz, 1966) + Approach/Avoidance (Elliot & Covington, 2001)

**6 Perfis de Compra + 2 Modificadores:**

| # | Perfil | Big Five dominante | Essencia |
|---|--------|-------------------|----------|
| 1 | Explorador | Openness ALTA | Busca informacao, novidade, quer entender tudo antes de decidir |
| 2 | Racional | Conscientiousness ALTA | Processo, dados, ROI, previsibilidade (unifica antigos Metodico + Analitico) |
| 3 | Conector | Extraversion + Agreeableness ALTAS | Prova social, comunidade, pertencimento |
| 4 | Protetor | Neuroticism ALTO | Seguranca, garantias, zero risco (unifica antigos Cauteloso + Receoso — espectro) |
| 5 | Executor | Extraversion ALTA + Neuroticism BAIXO | Direto, rapido, resultado imediato |
| 6 | Criador | Openness MUITO ALTA + Conscientiousness BAIXA | Customizacao, co-criacao, singularidade |

Modificadores (overlay sobre qualquer perfil):
- **Decisor Organizacional** — decidindo em nome de grupo/empresa (antes era avatar "Influenciador" — e um papel, nao perfil psicologico)
- **Padrao de Lealdade** — cliente recorrente medido por RFM (antes era avatar "Fiel" — e desfecho comportamental, nao estilo decisorio)

**5 Dimensoes do Perfil (ortogonais):**
1. Personalidade — tracos estaveis Big Five (Costa & McCrae, 1992)
2. Processo de decisao — velocidade + necessidade de informacao (Kahneman, 2011)
3. Motivacao — aproximacao vs evitacao (Elliot & Covington, 2001)
4. Nivel de consciencia — unaware a most-aware (Schwartz, 1966)
5. Barreiras ativas — objecoes racionais + emocionais (Thaler & Sunstein, 2008)

Removidas da v1: Autoconfianca (redundante com Neuroticism do Big Five) e Engajamento (e input do sistema, nao dimensao do perfil).

**3 Eixos de Decisao:**
- Velocidade: Rapido (System 1) <-> Analitico (System 2)
- Orientacao social: Individual <-> Social
- Motivacao: Aproximacao <-> Evitacao

**BSQL Score** (Behavioral Selling Qualification Level):
- Substitui BANT (Budget, Authority, Need, Timing)
- 5 fatores: consciencia do problema (20%), confianca na fonte (25%), confianca na solucao (25%), confianca em si (15%), urgencia real (15%)
- Pesos calibrados por expert judgment em 700+ projetos (2008-2026)
- Score 0-100: frio (0-40) / morno (41-60) / quente (61-80) / pronto (81-100)

**Camada RFM (clientes existentes):**
- Recency x Frequency x Monetary — segmentacao objetiva de valor
- Cruzamento RFM x Perfil gera acoes especificas (ex: "RFM alto + Executor = renovacao direta")
- Complementa perfilamento comportamental com dados transacionais

Documento completo: `docs/methodology/behavioral-selling-framework-v2.md`

### 6.2 O que o perfilamento entrega na pratica

| Capacidade | O que faz | Resultado |
|-----------|----------|-----------|
| Classificacao automatica | Identifica perfil pelo comportamento (cliques, tempo, respostas) via Bayesian Updating | Cada lead tem perfil + confianca, nao so nome |
| Abordagem adaptada | Recomenda tom, copy, sequencia, canal e timing por perfil | Mesmo produto, 6 formas de vender + 2 modificadores |
| Segmentacao por perfil x produto | Cruza perfil comportamental com catalogo de ofertas | "Racional converte 3x mais no produto X com copy de dados e ROI" |
| Copy prescritiva | Gera sugestoes de copy por perfil e fase de consciencia (Schwartz) | SDR recebe script adaptado ao perfil + nivel de awareness |
| Potencial de compra | Scoring de capacidade de expansao via RFM + perfil | "Cliente RFM alto + Explorador = upsell com conteudo exclusivo" |
| Descoberta de interesses | Analisa conteudo consumido, paginas visitadas, produtos vistos | "Cluster de Criadores se interessa por [tema] — criar oferta sob medida" |
| Retencao personalizada | Cruza RFM (valor) com perfil (estilo) para reativacao | "RFM caindo + Protetor = reativacao gentil, sem pressao" |

### 6.3 Enriquecimento de dados

**Fontes de enriquecimento (pay-per-use):**

| Tier | Dados | Provedores | Custo |
|------|-------|-----------|-------|
| 1 — Cadastral | CNPJ/CPF, razao social, CNAE, socios | Serpro, ReceitaWS, CNPJa, BrasilAPI | R$0,02-0,50/consulta |
| 2 — KYC | Validacao identidade, background check, face match | BigDataCorp, Truora, Certta | R$0,50-15/consulta |
| 3 — Credito | Score PF/PJ, restricoes, Cadastro Positivo | BigDataCorp (agrega bureaus) | Via API unica |
| 4 — Judicial | Processos, certidoes, protestos, antecedentes | InfoSimples, Docket | R$0,20-15/consulta |
| 5 — Social | Instagram, LinkedIn, Google Maps | Apify + APIs oficiais | $49/mes + API costs |

**Fluxo:**
```
Lead entra -> Tagueamento automatico (canal/UTM)
          -> Identity Resolution (merge cross-system)
          -> Enriquecimento cadastral (CNPJ/CPF)
          -> Perfilamento comportamental (avatar + BSQL)
          -> Enriquecimento profundo (credito, judicial — sob demanda)
          -> Lead completo: origem + perfil + score + potencial
```

---

## 7. DOIS ICPs, MESMO PRODUTO

### ICP 1: Empresa tradicional (servicos, industria, varejo)

| Aspecto | Detalhe |
|---------|---------|
| Sistemas | ERP (Omie, TOTVS), CRM (HubSpot, RD), PABX, site |
| Canais | Telefone, email, form, evento presencial, WhatsApp |
| Dor principal | Sistemas nao conversam, leads somem, zero visao da jornada |
| Ticket | R$3-15K/mes |
| Conectores | Omie, TOTVS, HubSpot, RD Station, Salesforce |

### ICP 2: Infoprodutor / empresa digital

| Aspecto | Detalhe |
|---------|---------|
| Sistemas | Hotmart/Kiwify, ActiveCampaign, ManyChat, Instagram, YouTube |
| Canais | DM, WhatsApp, webinar, live, comunidade, email |
| Dor principal | Fatura milhoes, nao sabe onde perde. Listas de lancamento desperdicadas |
| Ticket | R$2-8K/mes |
| Conectores | Hotmart, Kiwify, Eduzz, ActiveCampaign, Memberkit |

### Vazamentos especificos do digital

| Vazamento | Volume tipico |
|-----------|-------------|
| Leads de lancamento sem follow-up humano | 60-80% da lista |
| Alunos que compraram e nunca acessaram | 30-50% dos compradores |
| Assinantes com zero engajamento ha 30 dias | 25-40% da base |
| DMs nao respondidas durante lancamento | 40-70% das mensagens |
| Compradores do produto A que nunca viram produto B | 80-90% da base |
| Webinar: 2.000 inscritos, 400 assistiram, 0 follow-up nos 1.600 | 80% desperdicado |

**Mesmo produto, conectores diferentes. Jornada Universal e a mesma. Scorecard e o mesmo. Diagnostico e o mesmo.**

---

## 8. MODELO DE ENTREGA

Nao e self-service. O problema e complexo demais para o empresario resolver sozinho.

### 3 Camadas de valor

```
1. A TECNOLOGIA (o software)
   Conectores, identity resolution, scorecard, IA prescritiva
   -> Faz o que nenhum humano consegue fazer na mao

2. A METODOLOGIA (o Oitavo Dia)
   Jornada Universal, 8 Esferas, framework de diagnostico
   -> Diz O QUE olhar e POR QUE

3. A IMPLEMENTACAO (Wyndson / consultores certificados)
   Conectar sistemas, configurar rastreamento, treinar time
   -> Faz funcionar na realidade daquela empresa
```

Nenhum concorrente tem as 3 juntas.

### Fases de entrega

```
FASE 1: Implementacao assistida (2-4 semanas)
  -> Conectar sistemas, configurar canais, mapear jornada
  -> Tagueamento e UTMs configurados
  -> Perfilamento ativado
  -> AQUI esta o valor da consultoria/mentoria

FASE 2: Operacao autonoma (dia a dia)
  -> Scorecard atualiza sozinho
  -> Alertas de vazamento automaticos
  -> IA prescreve acoes
  -> Perfilamento refina via Bayesian Updating
  -> O GESTOR olha e age

FASE 3: Revisao estrategica (trimestral)
  -> Analise da espiral — "evoluiu ou esta em circulo?"
  -> Ajuste de canais, metas, playbooks
  -> Analise de cohort e decisao de investimento
  -> AQUI entra a mentoria Oitavo Dia
```

---

## 9. CONEXAO COM OITAVO DIA

### Arquitetura de marca

```
WYNDSON OLIVEIRA (marca pessoal — a face)
    |
    |-- OITAVO DIA (metodo — como ENSINA)
    |       |-- 8 Esferas (diagnostico macro do negocio)
    |       |-- Jornada do Cliente (operacao — 7 fases)
    |       |-- Esteira de Valor (monetizacao)
    |       |-- Livro, palestras, podcast, programa
    |
    |-- ELEXIA (tecnologia — como OPERACIONALIZA)
            |-- Produto unico (Platform + Cortex fundidos)
            |       |-- Jornada Universal (7 fases — UI operacional)
            |       |-- Scorecard 8 Esferas (diagnostico macro)
            |       |-- Scorecard Jornada (diagnostico por fase)
            |       |-- Detector de Vazamento (multicanal)
            |       |-- Growth Channels (atribuicao + ROI)
            |       |-- Behavioral Intelligence (perfilamento + BSQL)
            |       |-- Enriquecimento de dados
            |       |-- AI Engine (Cortex = cerebro interno)
            |       |-- CRM + Multichannel inbox
            |       |-- Playbooks prescritos por IA
```

### Funil de entrada

```
CONTEUDO (palestra/livro/podcast)
    |  "Seu negocio tem 8 esferas"
    v
ASSESSMENT GRATUITO (8 Esferas online)
    |  "Sua Esfera Clientes esta em 4/15 — critica"
    v
ELEXIA (ferramenta que resolve)
    |  "Aqui voce conecta, enxerga, conhece e age"
    v
MENTORIA / PROGRAMA (Oitavo Dia)
    |  "Eu te guio nas 8 esferas com a ferramenta"
    v
CONSULTORIA / PARTNERSHIP
       "Implementacao completa"
```

**O livro cria a consciencia. O assessment confirma a dor. O produto resolve. A mentoria acompanha.**

---

## 10. FRASES DE POSICIONAMENTO

### Frase principal
> "Seus sistemas nao conversam. Seus dados nao se encontram. Seus leads somem entre um canal e outro. Voce gasta para atrair e perde porque ninguem atende. O Elexia conecta tudo, mostra onde esta vazando, e diz o que fazer — com numeros, nao com opiniao."

### Frase do balde furado
> "Voce esta pagando para trazer gente. E perdendo a maioria porque ninguem atende."

### Frase do loop completo
> "Nao e sobre quantos leads voce gerou. E sobre quantos voce ATENDEU, em quanto tempo, e quantos viraram dinheiro."

### Frase do perfilamento
> "O mercado trata todos os leads igual. Mesmo script, mesmo tom, mesma oferta. 70% dos qualificados nao convertem — nao porque nao querem comprar, mas porque a FORMA como voce vendeu nao encaixou na FORMA como ele decide."

### Frase da atribuicao
> "YouTube parece pessimo na primeira semana. Mas em 90 dias converte melhor que Google Ads. Quem olha so o curto prazo mata os melhores canais."

---

## 11. DIFERENCIACAO COMPETITIVA

| Concorrente | O que faz | O que NAO faz |
|------------|----------|-------------|
| HubSpot | CRM + marketing automation | Nao faz identity resolution cross-system, nao tem perfilamento comportamental, nao conecta ERP brasileiro |
| RD Station | Marketing + CRM basico | Nao faz atribuicao multi-touch real, nao detecta vazamento por canal |
| Salesforce | CRM enterprise | Caro, complexo, nao faz behavioral profiling, nao conecta Omie/TOTVS nativamente |
| Google Analytics | Web analytics | Nao conecta com CRM, nao rastreia WhatsApp/telefone, nao mostra receita por lead |
| Power BI / Looker | Dashboards | Precisa de engenheiro de dados, nao prescreve acao, nao perfila leads |
| Hotmart | Plataforma de infoproduto | Nao conecta com CRM, nao faz follow-up de quem nao comprou, nao mostra vazamento |

**Nenhum faz o loop completo: do clique ao caixa, passando por todos os canais, com perfilamento comportamental e prescricao de acao.**

---

## 12. ASSETS EXISTENTES (ja construidos)

### Pesquisa e frameworks
- Behavioral Selling Framework v2.0 (6 perfis + 2 modificadores, 5 dimensoes, 3 eixos, BSQL, RFM)
  - Local: `docs/methodology/behavioral-selling-framework-v2.md`
  - System prompt do agente: `docs/methodology/behavioral-profiler-system-prompt-v2.md`
  - Fundamentacao: 8 bases teoricas validadas (Big Five, Kahneman, Schwartz, Cialdini, Fogg, Thaler, Elliot, Hughes)
- Agentes de Perfilamento Comportamental (vendas + educacao)
  - Local: `/code/1-Pesquisas/agentes-perfilamento/`
- Lead Scraping + KYC + Enriquecimento (stack completa de provedores)
  - Local: `/code/elexia-lead-scrap/`

### Codigo existente (elexia-cortex)
- `services/tokenization/` — HMAC-SHA256, DuckDB
- `services/rbac/` — 5 roles com heranca
- `services/audit/` — hash-chain SHA-256
- `infra/terraform/` — EKS, KMS, Vault HA

### Codigo existente (elexia-platform)
- ~100 modelos Prisma, 32 modulos de API
- CRM nativo, behavioral profiling, lead scoring, aquisicao multicanal
- Jornada Universal (7 fases), scorecard, diagnosticos automaticos
- CS Intelligence (churn, health score, retention)
- Data quality (dedup, cleaning, gates)
- AI Engine + AI Copilot
- Playbooks + automacao
- Multichannel inbox (WhatsApp, Instagram, Telegram, Webchat)

### Metodo Oitavo Dia (wyndson)
- 8 Esferas — framework completo com 24 perguntas de assessment
- Jornada do Cliente — 8 fases com agentes IA por fase
- Esteira de Valor — 8 degraus de monetizacao
- Brand book, posicionamento, tom de voz, storytelling
  - Local: `/code/wyndson/docs/`

---

## 13. WAVES DE CONSTRUCAO (validado 27/Jun/2026)

### Estrategia: wedge product (Detector de Vazamento) + land and expand

Nao construir tudo de uma vez. Lancar com o Detector de Vazamento como produto de entrada.
Depois expandir dentro da conta para scorecard, perfilamento, atribuicao.

### 5 Stacks mais comuns do Brasil (caminhos de integracao)

| Stack | ICP | Fontes de dados | APIs disponiveis |
|-------|-----|----------------|-----------------|
| 1. RD Station + Hotmart/Kiwify | Infoprodutor | Leads, emails, vendas, acessos curso, checkout | RD REST API + Hotmart API/Webhooks |
| 2. Omie + WhatsApp Business | PME servicos | Orcamentos, clientes, NFs, mensagens, tempo resposta | Omie REST API + WTS/FLW API |
| 3. HubSpot + WordPress | Mid-market | Contatos, deals, emails, forms, calls | HubSpot REST API (excelente) + WP REST |
| 4. TOTVS + PABX | Industria/varejo | Clientes, pedidos, faturamento, chamadas | TOTVS API + CDR (Call Detail Records) |
| 5. Planilha + Instagram + WhatsApp | Micro | Lista manual, DMs, mensagens | Sheets API + Meta Graph API + WTS |

### Wave 1 — MVP (dados que ja tem)

**Fonte:** WhatsApp (WTS/FLW) + Elexia CRM (banco proprio)
**O que mede:**
- WhatsApp: mensagens recebidas vs respondidas, tempo de resposta, conversas abandonadas
- CRM: leads criados vs contatados, leads sem atividade, tempo ate primeiro contato
- Pipeline: deals parados, orcamentos sem retorno

**Entregavel:** Relatorio de vazamento com 2-3 canais + estimativa de perda em R$/mes
**Prazo:** Funcional em semanas, nao meses
**Clientes:** Base atual da Elexia Platform

### Wave 2 — Primeiros clientes externos

**Conectores:** Stack 2 (Omie + WhatsApp) + Stack 1 (RD Station + Hotmart)
**O que adiciona:**
- Omie: orcamentos sem retorno, clientes inativos, vendas por vendedor
- RD Station: leads sem follow-up, emails ignorados, LPs com bounce
- Hotmart/Kiwify: compradores que nunca acessaram, checkout abandonado, churn

**Entregavel:** Detector de vazamento multi-stack + scorecard basico da jornada
**Clientes:** 2 ICPs prioritarios (PME servicos + infoprodutores)

### Wave 3 — Expansao

**Conectores:** Stack 3 (HubSpot) + Stack 4 (TOTVS + PABX) + Stack 5 (micro)
**O que adiciona:**
- HubSpot: attribution, deals, calls (API excelente — rapido de integrar)
- TOTVS: faturamento, pedidos (mais complexo)
- PABX: chamadas perdidas, horarios sem cobertura
- Attribution/UTMs, cohort por canal, perfilamento comportamental

**Entregavel:** Plataforma completa com as 5 entregas de valor

---

## 14. RECOMENDACOES DO ADVISORY COUNCIL (27/Jun/2026)

Sessao com: Marc Benioff, Alex Hormozi, Yamini Rangan, Flavio Augusto, Peter Fader
Documento completo: `docs/strategy/advisory-council-product-vision.md`

### Forcas unanimes (5/5)
1. Detector de Vazamento Multicanal — diferencial competitivo imediato
2. Flywheel Metodo (Oitavo Dia) + Ferramenta (Elexia) — raro e dificil de copiar
3. Experiencia real do founder + base instalada (200K+ pessoas)

### Riscos reais
1. Onboarding de 2-4 semanas nao escala — meta: time-to-value em 72h
2. Founder como gargalo — precisa de socio comercial ou head de vendas
3. Framework comportamental — reestruturado na v2.0 com 8 bases teoricas validadas (Jun/2026). Risco de credibilidade mitigado por ancoragem academica

### Top 5 acoes priorizadas
1. Lancar com Detector de Vazamento como wedge (land and expand)
2. Diagnostico gratuito + primeiro mes R$1 — acumular 20 cases em 6 meses
3. Time-to-value em 72h — conectores pre-configurados para os 5 stacks BR
4. Socio comercial imediatamente
5. Framework reestruturado (v2.0 — Jun/2026): 10 avatares reduzidos a 6 perfis + 2 modificadores, 7 dimensoes a 5, ancoragem em 8 bases teoricas validadas, RFM integrado

---

## 15. DECISOES PENDENTES

1. Nome do produto unificado — continua "Elexia" ou novo nome?
2. Repo strategy — merge cortex no platform ou manter separado?
3. Qual stack da Wave 2 construir primeiro (Omie ou RD Station)?
4. Escopo exato do MVP Wave 1 (quais metricas no primeiro relatorio)
5. Modelo de pricing final (diagnostico gratuito + R$1 primeiro mes + plano mensal)

---

*Documento de Visao de Produto Unificado — Cipher (Elexia Master) — 26-27/Jun/2026*
*Fonte: Sessao estrategica Founder + Cipher, integrando assets de 4 projetos*
*Projetos consolidados: elexia-cortex, elexia-platform, wyndson (Oitavo Dia), elexia-lead-scrap*
*Pesquisa de mercado: docs/strategy/market-research-global.md*
*Advisory Council: docs/strategy/advisory-council-product-vision.md*
