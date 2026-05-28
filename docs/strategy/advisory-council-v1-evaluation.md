# Conselho de Especialistas — Avaliacao Estrategica Elexia Cortex V1

**Data:** 28/Mai/2026
**Participantes:** 4 especialistas (Mercado, Dados/IA, Produto, Growth/GTM)
**Status:** Parecer entregue, aguardando decisoes do founder

---

## ESPECIALISTA 1: Estrategista de Mercado (perfil Andreessen/Horowitz)

### Posicionamento
- "Palantir + SAP Data Intelligence para o Brasil" e FRACO e PERIGOSO
- Palantir assusta (USD 10M+). SAP Data Intelligence foi descontinuado
- Recomendacao: posicionar pelo problema, nao pela analogia
- Sugestao: "Customer Intelligence Platform com IA preditiva e governanca nativa"

### Timing
- EXCELENTE: LGPD enforcement + Shadow AI + vazio de CDP no Brasil = janela perfeita
- Risco: construir demais antes do primeiro cliente

### Competidores
- Nenhum faz "ingestao + transform + C360 + IA + governanca LGPD + UI" numa plataforma para BR
- Barreiras: LGPD nativa, sa-east-1, suporte PT-BR, DPA/SCCs para ANPD
- Segment/Twilio: zero IA preditiva, zero LGPD. Databricks: nao e produto, e infra. Palantir: R$5M+

### Go-to-Market
- Falta o MAIS IMPORTANTE: primeiro cliente externo
- Congressy e case interno (prova de tech, nao de negocio)
- Recomendacao: 2 design partners em 60 dias + 1 vendedor enterprise senior

### Mudanca #1
- Reduzir Fase 0 pela metade, lancar demo em 30 dias (nao 90)
- 1 vertical perfeita > 4 mediocres

---

## ESPECIALISTA 2: Dados & IA (perfil DJ Patil/Hilary Mason)

### Inovacao Real
- 80% do Cortex e composicao de open-source (Airbyte, dbt, ClickHouse, MLflow, Cube.dev)
- O que E genuinamente forte:
  1. Identity Resolution com PPRL (Bloom Filters) — unico no BR
  2. Audit log hash-chain (SHA-256 encadeado) — elegante para compliance
  3. Tokenizacao deterministica (HMAC-SHA256) — analytics sobre dados protegidos

### O "10x Moment"
- "Quais clientes vou perder no proximo trimestre?" → lista rankeada + motivos + acao
- Story 0.13 (Cortex Intelligence) so faz Nivel 1 (descritivo). O 10x e Nivel 2 (preditivo)
- Prospect pergunta "por que perco clientes?" e recebe resposta com confianca estatistica

### Jornada Universal como Diferencial
- SCORE 9/10 — "voce esta subestimando o quanto"
- Lock-in cognitivo: quando o cliente pensa em "taxa de conversao da fase 3 para 4", usa SEU framework
- Universalmente aplicavel, proprietario, diferencia no pitch instantaneamente
- Recomendacao FORTE: Customer Journey 360 como eixo central, nao feature lateral
- Cube.dev schema com JourneyPhase como dimensao primaria de TODOS os cubes

### Data Moat
- Hoje: nao tem moat. Mas tem caminho:
  1. Benchmarks anonimizados cross-tenant (network effect mais facil)
  2. Federated Learning cross-tenant (moat tecnico real)
  3. Identity graph cross-event (200K pessoas enriquece com cada novo evento)
- Priorizar benchmarks como feature V1

### Congressy como Case
- Funciona para demo (volume real, diversidade de clusters)
- NAO funciona para enterprise (case interno, sem ROI quantificado)
- Falta: ROI monetario, tempo de implementacao, antes/depois

### Clean Room
- Viavel e inovador no Brasil (LiveRamp/Habu nao operam aqui)
- NAO e para V1 (precisa volume 500K-1M+, multiplos tenants, marco juridico)
- PPRL (Story 0.5) e a base tecnica correta
- Manter no roadmap Fase 2

### Risco Critico
- NAO e tecnico — e go-to-market
- Padrao classico: fundador tecnico brilhante constroi produto perfeito, nao vende
- Segundo risco: 11 tecnologias em producao com equipe pequena

### Mudanca #1
- Jornada Universal como camada semantica primaria do Customer 360
- Transforma Cortex de "mais um data platform" para categoria propria

---

## ESPECIALISTA 3: Product Strategist (perfil Shreyas Doshi/Gibson Biddle)

### Product-Market Fit
- Dor e real, mas produto posicionado como INFRAESTRUTURA, nao como RESULTADO
- Ninguem acorda pensando "preciso de Data Fabric". Acordam pensando "perdi 30% dos clientes"
- Quem sente agora: eventos (tem dados), varejo, educacao, saude

### Complexidade
- Complexo demais para BR tal como esta posicionado
- R$3M e ciclo de 12-18 meses com RFP e comite
- Vender USE CASE KILLER, nao plataforma inteira
- "Cortex Customer 360 — unifique dados em 48h e veja quem vai churnar"

### Time-to-Value
- "Se nao for HORAS, o produto morre antes de nascer"
- Congressy case deveria ser a DEMO PADRAO
- Conector PostgreSQL/MySQL generico e PRE-REQUISITO EXISTENCIAL

### Jornada Universal
- Diferencial REAL de UX se for funcional (nao so nomenclatura)
- Teste acido: diretor comercial entende em 10 segundos?
- Deveria ser NAVEGACAO PRIMARIA do produto, nao feature

### PLG vs Enterprise
- Enterprise first, PLG depois
- Free tier = demo engine, nao produto
- "PLG-assisted enterprise sales": demo que se vende sozinha

### O que CORTAR (40%)
- CORTAR: AI Chat conversacional, On-Premise, ML generico, 5+ verticais, DLP ativo
- MANTER: Conector PG/MySQL, C360+Jornada, 2-3 modelos preditivos, dashboards

### Kill Question
- "Quantos clientes da Platform pediram espontaneamente algo que o Cortex resolve?"
- Se varios pediram: PMF validado. Se nenhum: solucao procurando problema.

---

## ESPECIALISTA 4: Growth & GTM (perfil Tunguz/Lemkin)

### PMF (lente GTM)
- PMF nao esta no Cortex sozinho — esta no ECOSSISTEMA (Platform + Cortex + Events)
- Cortex sem Platform = cerebro sem corpo. Platform sem Cortex = corpo sem cerebro
- Pergunta: sao dois produtos ou UM com dois pontos de entrada?

### GTM Sequencia
| Fase | Timeline | Target | Deal Size |
|------|----------|--------|-----------|
| Founder-led | Meses 1-6 | Rede pessoal | R$50-150K/ano |
| Enterprise lite | Meses 6-12 | Mid-market | R$150-500K/ano |
| Enterprise full | Meses 12-24 | Large | R$500K-3M/ano |
| SaaS scale | Meses 18+ | Self-serve | R$24-120K/ano |

- Projecao R$4-8M ARR Ano 1 e IRREALISTA. R$1-2M e crivel e ja seria excelente.

### Pricing
- R$1.990 Starter e BARATO DEMAIS pelo que oferece (sinaliza inferior)
- 5 tiers e CONFUSAO
- Sugestao: 3 tiers — Free (7 dias full-feature), Professional R$4.990, Enterprise custom
- Cobrar por VALOR (insights gerados), nao COMMODITY (registros/conectores)

### O que CORTAR
- 3 modelos deploy → Managed only (BYOC sob demanda)
- 5 tiers → 3 tiers
- Projecao ARR → R$1-2M (credibilidade)

### Kill Question
- "Mostre-me a ultima vez que um cliente da Platform pediu dados de outro sistema — e o que aconteceu quando voce nao poude atender."

---

## SCORECARD CONSOLIDADO

| Dimensao | Score | Comentario |
|----------|-------|-----------|
| Arquitetura tecnica | 8/10 | Solida, choices corretos |
| Seguranca/Compliance | 9/10 | Enterprise-grade, acima do mercado BR |
| Inovacao proprietaria | 5/10 | Composicao competente de OSS, pouco valor proprietario alem de PPRL |
| Posicionamento | 4/10 | Analogia Palantir fraca, falta clareza de categoria |
| Go-to-market | 3/10 | Zero clientes, zero vendedores, zero design partners |
| Data moat potencial | 7/10 | Building blocks corretos, falta executar |
| Timing de mercado | 9/10 | Janela perfeita (LGPD + shadow AI + vazio CDP BR) |
| Jornada Universal | 9/10 | Potencialmente a decisao mais importante |

---

## CONSENSOS UNANIMES (4/4 especialistas)

1. **Jornada Universal e o diferencial real.** Customer Journey 360 como eixo central, nao feature.
2. **Cortar 40% do escopo.** 1 vertical perfeita > 4 mediocres. Demo em 30 dias.
3. **Time-to-value em HORAS.** Conector PG/MySQL generico e pre-requisito existencial.
4. **Posicionar por RESULTADO, nao por INFRAESTRUTURA.** Ninguem compra "Data Fabric".
5. **GTM e o maior risco.** Construir demais, vender de menos = padrao classico de morte.
6. **Ecossistema e a forca.** Platform + Cortex + Events = ninguem no Brasil tem isso.
7. **Pricing: simplificar para 3 tiers, cobrar por valor.**

## PERGUNTA CENTRAL

"Voces querem ser o Databricks brasileiro (plataforma generica, ciclo longo, compete com gigantes) ou o sistema nervoso central de operacoes orientadas ao cliente (nicho defensavel, PMF claro, compete com ninguem)?"
