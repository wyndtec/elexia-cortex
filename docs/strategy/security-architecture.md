# Elexia Cortex — Arquitetura de Segurança e Proteção de Dados

**Data:** Maio 2026
**Status:** Aprovado — base para requisitos de segurança do PRD
**Escopo:** Criptografia, DLP, Forensics, Governance, Compliance multi-regulatório

---

## A PIRÂMIDE DE PROTEÇÃO

```
Nível 5 — Contexto e Invalidação Automática
Nível 4 — Hardware-Bound Keys (TPM/HSM/Attestation)
Nível 3 — Cruzamento Protegido (PPRL, SMPC, Differential Privacy, TEE)
Nível 2 — Criptografia por Campo (Column-Level + Tokenização)
Nível 1 — Criptografia do Banco (TDE)
```

Cada nível é independente. Um atacante que supere o Nível 1 ainda tem 4 camadas.

---

## NÍVEL 1 — TDE (Transparent Data Encryption)

- Arquivo físico do banco criptografado em disco
- Chave mestra vive no KMS (AWS KMS / HashiCorp Vault)
- O banco nunca tem a chave — pede ao KMS a cada operação
- **Crypto-shredding**: cancelamento de contrato → KEK deletado → dado matematicamente ilegível para sempre
- Cumpre LGPD Art. 18 (direito ao esquecimento) de forma criptograficamente completa

---

## NÍVEL 2 — CRIPTOGRAFIA POR CAMPO + TOKENIZAÇÃO

### Padrão DEK/KEK

```
Dado real → [DEK] → ciphertext
DEK → [KEK] → encrypted DEK
KEK → [HSM/KMS] → nunca sai do hardware
```

Três camadas independentes. Comprometer uma não compromete as outras.

### Tokenização de PII

```
CPF "123.456.789-01" → Token "TKN-A7F3BC" (sem relação matemática)

O que o DBA vê no banco:
  id    cpf          email         ltv
  001   TKN-A7F3BC   TKN-B29C4A   R$48.000

Vault de tokenização: serviço separado, chaves separadas, audit log separado
```

### Tipos de dado e tratamento

| Tipo | Tratamento | Chave |
|------|-----------|-------|
| CPF, RG, passaporte | Tokenização | Vault key (separada) |
| Email, telefone | Tokenização | Vault key (separada) |
| Nome, endereço | Pseudonimização | Column DEK |
| Valores financeiros | Criptografia AES-256 | Column DEK por tenant |
| Dados analíticos (LTV, score) | Plaintext no warehouse | Acessível com role |

---

## NÍVEL 3 — PROTEÇÃO NO CRUZAMENTO DE DADOS

### PPRL (Privacy-Preserving Record Linkage)

Cruzamento de datasets por hash — nunca pelo identificador real:

```
CRM: hash(CPF_João) = a7f3bc → LTV R$48k
ERP: hash(CPF_João) = a7f3bc → 47 compras

JOIN por hash → perfil completo sem expor CPF em nenhum momento
```

### Privacidade Diferencial (Differential Privacy)

Para benchmarks e agregações — impede reconstrução de dados individuais por queries repetidas:

```
Resultado exato (inseguro): LTV médio = R$47.832
Resultado DP (seguro):      LTV médio = R$47.832 ± ruído controlado

Útil para decisão de negócio. Inútil para reconstruir registros individuais.
```

### TEE / SGX Enclaves (para cruzamentos de alta sensibilidade)

```
Dados A + Dados B → [Intel SGX / AWS Nitro Enclave] → Resultado agregado

Dentro do enclave:
  - Nem a Elexia vê o processamento
  - Nem o SO do servidor vê
  - Nem o hypervisor da AWS vê
  - Autodestruição se alguém tentar inspecionar a memória
```

---

## NÍVEL 4 — HARDWARE-BOUND KEYS

### HSM (Hardware Security Module)

- Chaves NUNCA saem do hardware
- Todas as operações criptográficas acontecem dentro do HSM
- Adulteração física: autodestrução das chaves
- FIPS 140-3 Level 3 certificado
- Opções: AWS CloudHSM, Thales Luna (on-premise)

### TPM (Trusted Platform Module) — para BYOC

```
1. TPM do servidor do cliente gera keypair internamente
2. Chave privada nunca sai do chip — fisicamente impossível
3. Dados do tenant criptografados com chave pública do TPM
4. Resultado: dado só funciona no hardware específico do cliente
   → Mover para outro servidor = ilegível
   → Clone de VM = sem TPM = ilegível
   → Servidor roubado = TPM com autodestruição configurável
```

### Attestation (o servidor prova que é ele mesmo)

```
Servidor → KMS: "Quero a chave do tenant X"
KMS valida:
  ✓ É o hardware registrado (fingerprint TPM)
  ✓ SO não adulterado (medições PCR)
  ✓ Código Cortex não modificado (hash do executável)
  ✓ Região geográfica correta (dados EU só em eu-central-1)
  ✓ Horário permitido pela política
  ✓ Contrato ativo

TODOS os critérios devem ser verdadeiros → chave liberada
Qualquer falha → acesso negado + alerta
```

---

## NÍVEL 5 — CONTEXTO E INVALIDAÇÃO AUTOMÁTICA

### Política de contexto por tenant

```yaml
key_policy:
  valid_conditions:
    - contract_status: "active"
    - request_region: ["sa-east-1"]        # dado BR só fica no Brasil
    - request_time: "06:00-22:00"
    - requester_role: ["app-server", "etl"] # não humanos
    - tls_version: ">=1.3"

  auto_revoke_if:
    - contract_expires: true               # cancelamento = crypto-shredding
    - violation_count: ">10"              # ataques = bloqueio permanente
    - anomalous_pattern: true             # uso anômalo = pausa automática
```

### Eventos de invalidação automática

| Evento | Ação automática |
|--------|----------------|
| Contrato encerrado | KEK deletado — crypto-shredding completo em < 60s |
| Funcionário demitido | Token revogado via SCIM em < 1 minuto |
| IP/país não autorizado | Sessão negada + alerta |
| Dado sendo movido entre regiões | KMS nega por geo-policy |
| Adulteração detectada na aplicação | KMS nega todas as chaves do ambiente |

---

## DATA GOVERNANCE — CONTROLE DE ACESSO

### RBAC + ABAC combinados

```
RBAC (por cargo):
  Owner → acesso total
  Admin → configura, não vê outras BUs
  Manager → sua equipe/região
  Analyst → consulta, export limitado
  Viewer → leitura, zero exportação

ABAC (por atributo do dado):
  Vendedor X → SOMENTE sua carteira
  Regional SP → SOMENTE estado = SP
  Financeiro → valores SEM PII
  Marketing → segmentos SEM indivíduos
```

### Controles de exportação

| Ação | Owner | Manager | Analyst | Viewer |
|------|-------|---------|---------|--------|
| Export < 100 registros | Sim | Sim | Sim | Não |
| Export < 10.000 | Sim | Com aprovação | Não | Não |
| Export > 10.000 | Sim | Não | Não | Não |
| Export com PII | Sim | MFA obrigatório | Não | Não |
| Export fora do horário | Sim | Justificativa | Bloqueado | Bloqueado |

---

## DLP + FORENSICS — DATA WATERMARKING

### Canary Records (armadilha ativa)

Registros fictícios com contatos únicos injetados na base:

```
"Empresa Canary-0037" → tel: 11 8888-0037 → email: alert-0037@cortex.elexia.com
```

Se o dado aparecer em uso externo (cold call, email): alerta em tempo real ao dono + log de quem baixou.

### Watermark estatístico por usuário

```
Usuário A vê: Cliente ABC → LTV R$48.003
Usuário B vê: Cliente ABC → LTV R$47.997
Dado vazado → análise matemática → identifica a sessão de origem
```

### Watermark em documentos

- **Visível**: rodapé com usuário, data, hora, session ID
- **Invisível**: Unicode de largura zero entre campos, pixel pattern em PDFs, metadados
- **Screen watermark**: nome do usuário sempre visível na tela durante acesso a dados sensíveis

### UEBA — Behavioral Analytics

```
Baseline de cada usuário: horário, volume, regiões acessadas
Anomalia detectada → alerta automático:

Ex.: Ana exportou 48k registros às 23h47 de IP desconhecido
  → Exportação pausada
  → Admin notificado
  → Sessão marcada como suspeita
  → MFA requerido para continuar
```

### Audit Log Forense (imutável, hash-chained)

```json
{
  "event_id": "EVT-2026-0524-A83F2",
  "timestamp": "2026-05-24T23:47:12.847Z",
  "user_email": "ana.souza@empresa.com",
  "action": "EXPORT",
  "record_count": 48372,
  "file_hash": "SHA256:a7f3bc...",
  "watermark_id": "WM-ANA-20260524-A83F2",
  "previous_hash": "SHA256:prev..." // hash-chain — adulteração quebra a cadeia
}
```

Pacote forense gerado automaticamente em caso de incidente:
- Extrato do audit log (assinado digitalmente)
- Hash do arquivo exportado
- Watermark decode report
- Canary alert log
- Timeline completa do incidente

Admissível como prova digital sob Marco Civil da Internet (Lei 12.965/14) e CPC.

---

## COMPLIANCE MULTI-REGULATÓRIO (V1 — não V2)

### Modelo de responsabilidade compartilhada

```
CLIENTE = Controlador de Dados
  → responsável pela legalidade do processamento
  → assina o DPA com a Elexia

ELEXIA = Processador de Dados
  → processa somente por instrução do controlador
  → não usa dados para outros fins
  → responsabilidade definida e limitada pelo DPA
```

### Documentos obrigatórios antes de vender

| Documento | Cobre | Prazo |
|-----------|-------|-------|
| DPA (Data Processing Agreement) | GDPR Art. 28, LGPD Art. 39 | Antes do 1º cliente |
| SCCs (Standard Contractual Clauses) | Transferência internacional EU → BR/US | Antes do 1º cliente EU |
| Adendo CCPA (Service Provider Agreement) | Dados de California | Antes do 1º cliente US |
| Security White Paper | Descreve todos os controles | Antes do 1º cliente |
| Pentest Report (empresa independente) | Substitui SOC 2 nos primeiros deals | Mês 2–3 |

### Residência de dados por jurisdição

```yaml
tenant: "empresa-com-clientes-globais"
data_residency:
  - jurisdiction: BR → aws/sa-east-1 → compliance: LGPD
  - jurisdiction: EU → aws/eu-central-1 → compliance: GDPR
  - jurisdiction: US → aws/us-east-1 → compliance: CCPA
```

### Roadmap de certificações

```
Launch (Q3 2026):       LGPD by architecture + DPA/SCCs + Pentest Report
Mês 3–6:               ISO 27001 iniciado
Mês 6–9:               SOC 2 Type I
Mês 12–18:             SOC 2 Type II + ISO 27001 certificado
Ano 2:                  GDPR Art. 42 + setoriais (SOX, PCI-DSS) por demanda
```

---

## STACK TÉCNICO DE SEGURANÇA

| Camada | Tecnologia |
|--------|-----------|
| HSM | AWS CloudHSM (Managed) / Thales Luna (BYOC) |
| KMS | AWS KMS com Customer Managed Keys |
| Secrets | HashiCorp Vault |
| TEE/Enclave | AWS Nitro Enclaves (SGX-based) |
| Tokenização | Serviço próprio + Vault de tokens |
| Audit | Imutable log + hash-chain (custom) |
| UEBA | OpenSearch + regras de anomalia customizadas |
| Compliance | Vanta (automação de evidências SOC 2/ISO 27001) |
| DLP | Controles de exportação no Semantic Layer |
| Watermark | Serviço próprio integrado ao export pipeline |
| Canary | Serviço próprio de injeção + monitoramento |

---

## PADRÕES ATENDIDOS POR DESIGN

| Padrão | O que cobre |
|--------|------------|
| FIPS 140-3 Level 3 | HSM certificado |
| NIST SP 800-57 | Key management lifecycle |
| ISO/IEC 27040 | Storage encryption |
| LGPD Art. 46 + Art. 12 | Medidas técnicas + pseudonimização |
| GDPR Art. 32 | State-of-the-art encryption |
| BACEN Res. 4.893/2021 | AES-256 para dados financeiros |
| Marco Civil da Internet | Logs admissíveis como prova digital |
