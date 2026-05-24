# Princípios de IA Responsável — Elexia Cortex

**Versão:** 1.0 — Maio 2026
**Audiência:** Pública — clientes, parceiros, reguladores, comunidade técnica

---

## Por que publicamos estes princípios

IA aplicada a negócios e especialmente a saúde pública exige transparência. Não como marketing — como contrato com os stakeholders que confiam seus dados à infraestrutura Elexia.

Estes princípios guiam todas as decisões de design, desenvolvimento e operação do Cortex.

---

## 1. Privacidade por Arquitetura

**O que significa:**
Dados pessoais nunca viajam para APIs externas de IA. Modelos rodam dentro do ambiente contratual do cliente. A privacidade não é uma camada de política — é uma propriedade estrutural do sistema.

**Como implementamos:**
- Federated learning: gradientes de modelos, nunca dados brutos
- Anonimização na borda: PII hashada antes de entrar no pipeline
- Sem dependência de modelos externos (OpenAI, Anthropic, Google) para dados sensíveis
- Modelos locais para casos de uso com dados regulados (saúde, financeiro)

---

## 2. Consentimento Rastreável

**O que significa:**
Nenhum dado é usado para treino de modelos sem base legal documentada e rastreável.

**Como implementamos:**
- Cada evento de ingestão carrega o `consent_basis` (contrato, legítimo interesse, consentimento explícito)
- Pipeline de deleção propaga para lake, warehouse e modelos quando consentimento é revogado
- Audit log imutável: quem acessou o quê e quando

---

## 3. Explicabilidade em Setores Regulados

**O que significa:**
Decisões que afetam pessoas (saúde, crédito, oportunidades) precisam de explicação auditável. "O modelo disse" não é resposta aceitável.

**Como implementamos:**
- Modelos em saúde: SHAP values obrigatórios para predições de risco
- Feature importance documentada e versionada com cada modelo
- Limite de complexidade para modelos críticos (interpretabilidade > performance marginal)
- Humano no loop para decisões irreversíveis

---

## 4. Sem Viés por Design

**O que significa:**
Modelos treinados em dados históricos replicam vieses históricos. Isso é especialmente crítico em saúde pública, onde vieses de acesso ao sistema se refletem nos dados de treino.

**Como implementamos:**
- Fairness audit obrigatório antes de qualquer modelo ir para produção
- Métricas de equidade por grupo demográfico (raça, gênero, faixa etária, região)
- Documentação de limitações de cada modelo no model card
- Re-treino acionado quando drift de equidade é detectado

---

## 5. Transparência sobre Limitações

**O que significa:**
Todo modelo tem limitações. Comunicá-las é responsabilidade da Elexia, não do cliente descobrir na prática.

**Como implementamos:**
- Model cards públicos para cada modelo em produção (inputs, outputs, performance por segmento, limitações conhecidas)
- SLAs de confiança: quando o modelo sinaliza baixa confiança, o sistema escala para humano
- Proibição de apresentar predições de IA como fatos clínicos ou diagnósticos definitivos

---

## 6. Sem Dependência Irresponsável

**O que significa:**
Sistemas críticos (saúde pública, infraestrutura municipal) não podem ter ponto único de falha em IA. A IA deve amplificar a capacidade humana, não substituir julgamento profissional.

**Como implementamos:**
- Modos de fallback para todos os serviços críticos
- IA como "segundo par de olhos", não como decisor final em contextos clínicos
- Treinamento obrigatório para profissionais que usam outputs de IA em decisões

---

## 7. Soberania de Dados do Tenant

**O que significa:**
Os dados do cliente pertencem ao cliente. O Cortex é custodian, não dono.

**Como implementamos:**
- Contrato de DPA (Data Processing Agreement) com cada produto/cliente
- Portabilidade: dados exportáveis em formatos abertos (FHIR, Parquet, CSV)
- Deleção: pipeline end-to-end que remove dados de lake, warehouse e modelos
- Sem uso de dados de um tenant para beneficiar outro tenant sem consentimento explícito

---

## Governança destes Princípios

Estes princípios são revisados a cada 6 meses e atualizados quando:
- Nova regulamentação relevante entra em vigor (LGPD, CFM, ANS, CVM)
- Novo tipo de dado ou modelo é incorporado ao Cortex
- Incidente de privacidade ou viés é identificado

Histórico de revisões: `CHANGELOG.md`

---

## Contato

Questões sobre AI governance, privacidade ou estes princípios:
- Técnico: abrir issue neste repositório
- Regulatório: compliance@elexia.com.br
- Imprensa/parceiros: growth@elexia.com.br
