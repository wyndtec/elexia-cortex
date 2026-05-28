# Analise: Congressy como Primeiro Case Real do Cortex

**Data:** 28/Mai/2026
**Autor:** Cipher (analise tecnica de dados)
**Status:** Analise concluida, aguardando decisao estrategica

---

## 1. Fontes de Dados

### Base Recente (PostgreSQL, 82MB)
- **Origem:** Servidor producao Congressy, dump 27/Mai/2026
- **Arquivo:** `/Users/wyndsonoliveira/code/congressy/congressy-dump-20260527.dump`
- **DB local restaurado:** `congressy_analysis` (PostgreSQL local)
- **Periodo:** 2018-2021
- **Engine:** Django (gatheros_event_*, gatheros_subscription_*)

### Base Legada (MySQL, 1.4GB)
- **Arquivo:** `/Users/wyndsonoliveira/Documents/Backup Congressy Dez 2020/dump01.sql`
- **Periodo:** 2017-2018
- **Estrutura:** 1 database por evento (467 databases cgs_*)

---

## 2. Volumes

| Entidade | PostgreSQL | MySQL Legado | Combinado |
|----------|-----------|--------------|-----------|
| Pessoas/perfis unicos | 117.065 | ~100K+ (est.) | ~200K+ |
| Inscricoes | 125.918 | 363.585 | ~490K |
| Eventos | 2.020 | ~467 | ~2.500 |
| Organizacoes | 92.785 | - | 92.785 |
| Transacoes financeiras | 37.300 (R$4.01M) | - | 37.300 |
| Check-ins | 42.173 | - | 42.173 |
| Respostas survey | 245.121 | - | 245.121 |

---

## 3. Qualidade dos Dados (PostgreSQL)

| Campo | Fill Rate |
|-------|-----------|
| Email | 92% (107K) |
| Telefone | 76% (88K) |
| CPF | 61% (71K) |
| CEP | 43% (51K) |
| Data nascimento | 49% (58K) |
| Genero | 92% (60% M / 40% F) |
| Instituicao | 21% (24K) |
| Funcao/cargo | 15% (18K) |
| CNPJ instituicao | 2.4% (2.8K) |

---

## 4. Clusters Profissionais Identificados

| Cluster | Evidencia | Volume Est. |
|---------|-----------|-------------|
| Religioso/Eclesiastico | PIB Marilia 17.9K, igrejas, pastores, lideres | ~40-50K |
| Agronegocio | FAEG/SENAR 17K, Embrapa, Sicredi | ~15-20K |
| Imobiliario | Corretores de imoveis (~634 funcoes) | ~3-5K |
| Academico | UFG, UEG, UFPR, estudantes | ~10-15K |
| Business/Empreendedorismo | CEOs, diretores, Deandhela | ~5-8K |
| Juridico/Notarial | Congresso Notarial, advogados | ~1-2K |
| Tecnologia | Hackathon, analistas | ~2-3K |

---

## 5. Geografia (por CEP)

| Regiao | Pessoas | % |
|--------|---------|---|
| GO/TO | 15.405 | 30% |
| SP Interior | 13.501 | 26% |
| SP Capital | 4.728 | 9% |
| RJ | 3.184 | 6% |
| PR | 2.719 | 5% |
| Demais | ~11K | 24% |

---

## 6. Comportamento

- 11.046 pessoas participaram de 2+ eventos (10.5%)
- 1 pessoa: 113 eventos
- Taxa confirmacao: 86.6%
- Ticket medio: R$107 (2018) -> R$166 (2019) (+54%)
- Receita total confirmada: R$4.01M

---

## 7. Top Organizacoes (por inscricoes)

1. PIB Marilia: 55 eventos, 17.939 inscricoes
2. FAEG/SENAR: 22 eventos, 16.975 inscricoes
3. Propositos Treinamentos: 4 eventos, 13.199 inscricoes
4. Rede Inspire: 31 eventos, 3.953 inscricoes
5. MB Summit: 28 eventos, 3.227 inscricoes

---

## 8. Framing Estrategico

**Eventos NAO sao uma vertical isolada. Sao um CANAL de aquisicao e relacionamento.**

Dados de eventos = touchpoints no Customer 360:

| Dado de evento | Entidade Customer 360 |
|----------------|----------------------|
| person | Customer Profile (identidade + localizacao) |
| subscription | Touchpoint (canal: evento, campanha: nome do evento) |
| checkin | Engagement (interacao confirmada) |
| transaction | Financial (LTV, ticket medio, frequencia) |
| survey_answer | Enrichment (profissao, segmento, interesses) |
| organization | Account (cliente B2B organizador) |
| Eventos frequentados | Behavior (clustering por tipo = interesse) |

---

## 9. Use Cases

### UC1: Audience Intelligence (Clusterizacao + Trafego Pago)
- ETL unificado -> dedup PII tokenizado -> clustering ML -> audience segments
- Modelo clean room: dados nunca saem, audiencias hashed para Meta/Google
- Empresas pagam para alcancar segmentos sem ver dados individuais

### UC2: Reativacao Elexia Events
- Score de reativacao por organizacao (volume, receita, ultima atividade)
- Top 50 orgs para campanha personalizada com nova marca

### UC3: Event Intelligence Dashboard (Demo Cortex)
- Dados reais (nao ficticios) para demo do pitch
