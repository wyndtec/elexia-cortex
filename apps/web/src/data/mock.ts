// Elexia Cortex — Mock Data
// Dados fictícios realistas com empresas brasileiras

export type HealthStatus = 'healthy' | 'at-risk' | 'critical'
export type ConnectorStatus = 'connected' | 'connecting' | 'available' | 'coming-soon'

export interface Customer {
  id: string
  name: string
  company: string
  segment: string[]
  healthScore: number
  healthStatus: HealthStatus
  churnScore: number
  ltv: number
  ticketMedio: number
  frequencia: number
  diasSemComprar: number
  lastContact: string
  nextAction: string
  revenue: number
  nps: number | null
  sources: string[]
  sparkline: number[]
}

export interface TimelineEvent {
  id: string
  date: string
  type: 'lead' | 'purchase' | 'support' | 'nps' | 'visit' | 'renewal' | 'churn-signal'
  title: string
  description: string
  source: string
  value?: number
}

export interface Connector {
  id: string
  name: string
  category: string
  status: ConnectorStatus
  lastSync?: string
  recordsSynced?: number
  description: string
  wave: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  data?: {
    type: 'table' | 'metric' | 'list'
    payload: unknown
  }
}

export interface AuditEntry {
  id: string
  timestamp: string
  action: string
  agent: string
  resource: string
  hash: string
  previousHash: string
  severity: 'info' | 'warning' | 'critical'
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────

export const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Ricardo Tavares',
    company: 'Grupo Tavares Alimentos',
    segment: ['Enterprise', 'Alimentos & Bebidas'],
    healthScore: 87,
    healthStatus: 'healthy',
    churnScore: 12,
    ltv: 1240000,
    ticketMedio: 68500,
    frequencia: 18,
    diasSemComprar: 14,
    lastContact: '2026-05-20',
    nextAction: 'Apresentar relatório Q2 — expansão para linha premium',
    revenue: 830000,
    nps: 9,
    sources: ['HubSpot', 'Omie', 'Shopify'],
    sparkline: [62, 65, 68, 71, 74, 78, 83, 87],
  },
  {
    id: 'cust-002',
    name: 'Fernanda Lopes',
    company: 'Infralog Transportes',
    segment: ['Enterprise', 'Logística'],
    healthScore: 54,
    healthStatus: 'at-risk',
    churnScore: 61,
    ltv: 590000,
    ticketMedio: 42000,
    frequencia: 14,
    diasSemComprar: 47,
    lastContact: '2026-04-08',
    nextAction: 'Ligação de retenção urgente — identificado sinal de churn',
    revenue: 310000,
    nps: 6,
    sources: ['HubSpot', 'Omie'],
    sparkline: [72, 68, 64, 61, 58, 56, 54, 54],
  },
  {
    id: 'cust-003',
    name: 'Dr. Marcelo Abreu',
    company: 'MedSul Saúde',
    segment: ['Mid-Market', 'Saúde'],
    healthScore: 92,
    healthStatus: 'healthy',
    churnScore: 8,
    ltv: 880000,
    ticketMedio: 55000,
    frequencia: 16,
    diasSemComprar: 7,
    lastContact: '2026-05-23',
    nextAction: 'Renovação contratual em 30 dias — preparar proposta expansão',
    revenue: 560000,
    nps: 10,
    sources: ['HubSpot', 'Salesforce', 'Omie'],
    sparkline: [80, 82, 85, 87, 89, 90, 91, 92],
  },
  {
    id: 'cust-004',
    name: 'Gustavo Mendes',
    company: 'Varejo Nordeste S.A.',
    segment: ['Enterprise', 'Varejo'],
    healthScore: 31,
    healthStatus: 'critical',
    churnScore: 84,
    ltv: 720000,
    ticketMedio: 48000,
    frequencia: 15,
    diasSemComprar: 89,
    lastContact: '2026-02-28',
    nextAction: 'URGENTE: Acionar CS sênior — risco crítico de cancelamento',
    revenue: 180000,
    nps: 3,
    sources: ['HubSpot', 'Shopify'],
    sparkline: [68, 60, 52, 47, 41, 36, 33, 31],
  },
  {
    id: 'cust-005',
    name: 'Camila Figueiredo',
    company: 'Fintech Crédito Fácil',
    segment: ['Mid-Market', 'Fintech'],
    healthScore: 76,
    healthStatus: 'healthy',
    churnScore: 19,
    ltv: 480000,
    ticketMedio: 32000,
    frequencia: 15,
    diasSemComprar: 21,
    lastContact: '2026-05-15',
    nextAction: 'Agendar QBR — oportunidade de upsell no módulo de compliance',
    revenue: 290000,
    nps: 8,
    sources: ['HubSpot', 'QuickBooks'],
    sparkline: [55, 58, 62, 65, 68, 71, 74, 76],
  },
]

// ─── CUSTOMER TIMELINE ────────────────────────────────────────────────────────

export const customerTimeline: Record<string, TimelineEvent[]> = {
  'cust-001': [
    {
      id: 'tl-001-01',
      date: '2023-03-15',
      type: 'lead',
      title: 'Lead qualificado',
      description: 'Inbound via LinkedIn — interesse em Customer 360 para rede de distribuição',
      source: 'HubSpot',
    },
    {
      id: 'tl-001-02',
      date: '2023-04-02',
      type: 'purchase',
      title: 'Primeiro contrato assinado',
      description: 'Plano Enterprise — 24 meses. Onboarding com equipe técnica',
      source: 'Omie',
      value: 85000,
    },
    {
      id: 'tl-001-03',
      date: '2023-09-10',
      type: 'support',
      title: 'Ticket #4821 — Integração ERP',
      description: 'Dificuldade na sincronização do módulo fiscal. Resolvido em 4h',
      source: 'HubSpot',
    },
    {
      id: 'tl-001-04',
      date: '2024-01-20',
      type: 'nps',
      title: 'NPS: 8/10',
      description: 'Pesquisa trimestral. Destaque positivo para velocidade de processamento',
      source: 'Internal',
      value: 8,
    },
    {
      id: 'tl-001-05',
      date: '2024-04-15',
      type: 'renewal',
      title: 'Renovação + expansão',
      description: 'Inclusão do módulo de IA preditiva. Aumento de 40% no ticket',
      source: 'Omie',
      value: 119000,
    },
    {
      id: 'tl-001-06',
      date: '2025-08-05',
      type: 'nps',
      title: 'NPS: 9/10',
      description: 'Promotor ativo — indicou MedSul Saúde como prospect',
      source: 'Internal',
      value: 9,
    },
  ],
}

// ─── CONNECTORS ───────────────────────────────────────────────────────────────

export const connectors: Connector[] = [
  {
    id: 'conn-hubspot',
    name: 'HubSpot CRM',
    category: 'CRM',
    status: 'connected',
    lastSync: '2026-05-25T10:42:00',
    recordsSynced: 48231,
    description: 'Contatos, negócios, atividades e pipelines de vendas',
    wave: '1A',
  },
  {
    id: 'conn-omie',
    name: 'Omie ERP',
    category: 'ERP',
    status: 'connected',
    lastSync: '2026-05-25T10:38:00',
    recordsSynced: 124890,
    description: 'Pedidos, notas fiscais, clientes e financeiro',
    wave: '1A',
  },
  {
    id: 'conn-shopify',
    name: 'Shopify',
    category: 'E-commerce',
    status: 'connecting',
    description: 'Pedidos, produtos, clientes e métricas de loja virtual',
    wave: '1A',
  },
  {
    id: 'conn-salesforce',
    name: 'Salesforce',
    category: 'CRM',
    status: 'available',
    description: 'CRM enterprise — objetos customizados, leads, oportunidades',
    wave: '1A',
  },
  {
    id: 'conn-quickbooks',
    name: 'QuickBooks',
    category: 'Financeiro',
    status: 'available',
    description: 'Transações, faturamento, categorias e relatórios financeiros',
    wave: '1A',
  },
  {
    id: 'conn-sap',
    name: 'SAP S/4HANA',
    category: 'ERP',
    status: 'coming-soon',
    description: 'ERP enterprise SAP — módulos SD, FI, MM e CO',
    wave: '1B',
  },
  {
    id: 'conn-rdstation',
    name: 'RD Station',
    category: 'Marketing',
    status: 'coming-soon',
    description: 'Leads, fluxos de automação e campanhas de marketing',
    wave: '1B',
  },
  {
    id: 'conn-totvs',
    name: 'TOTVS Protheus',
    category: 'ERP',
    status: 'coming-soon',
    description: 'ERP nacional — financeiro, RH, estoque e manufatura',
    wave: '1B',
  },
  {
    id: 'conn-pipedrive',
    name: 'Pipedrive',
    category: 'CRM',
    status: 'coming-soon',
    description: 'Pipeline de vendas, contatos e histórico de negócios',
    wave: '2A',
  },
  {
    id: 'conn-zendesk',
    name: 'Zendesk',
    category: 'Suporte',
    status: 'coming-soon',
    description: 'Tickets, CSAT, SLA e histórico de atendimento',
    wave: '2A',
  },
]

// ─── CHAT MESSAGES ────────────────────────────────────────────────────────────

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'assistant',
    content: 'Olá. Sou o Cortex Intelligence. Tenho acesso ao Customer 360 da sua base, dados de receita, scores preditivos e audit logs. Como posso ajudar?',
    timestamp: '2026-05-25T10:00:00',
  },
]

export const chatPresets = [
  'Quais clientes têm maior risco de churn este mês?',
  'Qual foi a receita total de abril/2026?',
  'Mostre os top 5 clientes por LTV',
  'Quais conectores estão com falha de sincronização?',
  'Qual o NPS médio da base nos últimos 90 dias?',
  'Identifique oportunidades de upsell por segmento',
]

export const chatResponses: Record<string, ChatMessage> = {
  'Quais clientes têm maior risco de churn este mês?': {
    id: 'resp-001',
    role: 'assistant',
    content: 'Identifiquei 2 clientes com churn score crítico (>75%) e 1 cliente em zona de atenção. Recomendo ação imediata nos dois primeiros.',
    timestamp: '2026-05-25T10:01:00',
    data: {
      type: 'table',
      payload: [
        { empresa: 'Varejo Nordeste S.A.', score: '84%', diasSemComprar: 89, acao: 'CS Sênior urgente' },
        { empresa: 'Infralog Transportes', score: '61%', diasSemComprar: 47, acao: 'Ligação de retenção' },
        { empresa: 'Fintech Crédito Fácil', score: '19%', diasSemComprar: 21, acao: 'Monitoramento' },
      ],
    },
  },
  'Mostre os top 5 clientes por LTV': {
    id: 'resp-002',
    role: 'assistant',
    content: 'Top 5 clientes por Lifetime Value acumulado. Os 3 primeiros representam 75% do LTV total da base.',
    timestamp: '2026-05-25T10:02:00',
    data: {
      type: 'table',
      payload: [
        { empresa: 'Grupo Tavares Alimentos', ltv: 'R$ 1.240.000', healthScore: '87%', status: 'Saudável' },
        { empresa: 'MedSul Saúde', ltv: 'R$ 880.000', healthScore: '92%', status: 'Saudável' },
        { empresa: 'Varejo Nordeste S.A.', ltv: 'R$ 720.000', healthScore: '31%', status: 'Crítico' },
        { empresa: 'Infralog Transportes', ltv: 'R$ 590.000', healthScore: '54%', status: 'Em risco' },
        { empresa: 'Fintech Crédito Fácil', ltv: 'R$ 480.000', healthScore: '76%', status: 'Saudável' },
      ],
    },
  },
  'Qual foi a receita total de abril/2026?': {
    id: 'resp-003',
    role: 'assistant',
    content: 'Receita consolidada de abril/2026 processada via Omie + QuickBooks.',
    timestamp: '2026-05-25T10:03:00',
    data: {
      type: 'metric',
      payload: {
        value: 'R$ 412.500',
        change: '+18,4%',
        period: 'vs março/2026',
        breakdown: [
          { label: 'Recorrente (MRR)', value: 'R$ 298.000' },
          { label: 'Upsell / Expansão', value: 'R$ 87.500' },
          { label: 'Onboarding / Setup', value: 'R$ 27.000' },
        ],
      },
    },
  },
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────

export const auditLog: AuditEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2026-05-25T10:42:31',
    action: 'DATA_EXPORT',
    agent: 'analyst@grupotatvares.com.br',
    resource: 'customers.export — 1.240 registros',
    hash: '7f4a2b9c1e8d3f6a',
    previousHash: '3c8e1a5b9d2f7e4c',
    severity: 'info',
  },
  {
    id: 'audit-002',
    timestamp: '2026-05-25T09:18:05',
    action: 'MODEL_INFERENCE',
    agent: 'cortex-intelligence-v2',
    resource: 'churn_prediction — batch 847 clientes',
    hash: '2e9f4c7a1b5d8e3f',
    previousHash: '7f4a2b9c1e8d3f6a',
    severity: 'info',
  },
  {
    id: 'audit-003',
    timestamp: '2026-05-25T08:55:12',
    action: 'ACCESS_ESCALATED',
    agent: 'devops@elexia.com.br',
    resource: 'data_lake.pii_vault — acesso privilegiado',
    hash: '5a1d8b4e7c2f9a6b',
    previousHash: '2e9f4c7a1b5d8e3f',
    severity: 'warning',
  },
  {
    id: 'audit-004',
    timestamp: '2026-05-24T23:00:00',
    action: 'SYNC_COMPLETED',
    agent: 'connector-omie-v3',
    resource: 'omie.nfe — 312 notas fiscais sincronizadas',
    hash: '8c3a6e1f4b9d2c7a',
    previousHash: '5a1d8b4e7c2f9a6b',
    severity: 'info',
  },
  {
    id: 'audit-005',
    timestamp: '2026-05-24T22:41:19',
    action: 'CANARY_TRIGGERED',
    agent: 'shield-monitor',
    resource: 'canary-record-CPF-***4821 — acesso detectado',
    hash: '1f7e3b9c5a2d8e4b',
    previousHash: '8c3a6e1f4b9d2c7a',
    severity: 'critical',
  },
]

export const piiInventory = [
  { field: 'CPF', systems: ['Omie', 'HubSpot'], legalBasis: 'Execução contratual', records: 5 },
  { field: 'E-mail', systems: ['HubSpot', 'Shopify', 'QuickBooks'], legalBasis: 'Legítimo interesse', records: 5 },
  { field: 'Telefone', systems: ['HubSpot'], legalBasis: 'Consentimento', records: 4 },
  { field: 'Endereço', systems: ['Omie'], legalBasis: 'Execução contratual', records: 5 },
  { field: 'Dados Financeiros', systems: ['Omie', 'QuickBooks'], legalBasis: 'Execução contratual', records: 5 },
]

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const kpis = {
  clientesAtivos: { value: 5, change: '+2', period: 'vs mês anterior', trend: 'up' as const },
  churnRiskAlto: { value: 2, change: '+1', period: 'vs mês anterior', trend: 'down' as const },
  ltvMedio: { value: 782000, change: '+12,4%', period: 'vs trimestre anterior', trend: 'up' as const },
  nrr: { value: 118, change: '+3pp', period: 'vs trimestre anterior', trend: 'up' as const },
}
