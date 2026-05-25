import React, { useState } from 'react'
import {
  Plug,
  CheckCircle2,
  Clock,
  Circle,
  Lock,
  X,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'
import { TopBar } from '../components/ui/TopBar'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { connectors } from '../data/mock'
import type { Connector, ConnectorStatus } from '../data/mock'

const statusConfig: Record<ConnectorStatus, {
  label: string
  badge: 'success' | 'warning' | 'info' | 'neutral'
  icon: React.ReactNode
  dot: boolean
}> = {
  connected: {
    label: 'Conectado',
    badge: 'success',
    icon: <CheckCircle2 size={12} strokeWidth={1.5} />,
    dot: true,
  },
  connecting: {
    label: 'Conectando',
    badge: 'warning',
    icon: <Clock size={12} strokeWidth={1.5} />,
    dot: false,
  },
  available: {
    label: 'Disponivel',
    badge: 'info',
    icon: <Circle size={12} strokeWidth={1.5} />,
    dot: false,
  },
  'coming-soon': {
    label: 'Em breve',
    badge: 'neutral',
    icon: <Lock size={12} strokeWidth={1.5} />,
    dot: false,
  },
}

function formatSyncTime(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatRecords(n?: number): string {
  if (!n) return '—'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ─── Wizard Modal ─────────────────────────────────────────────────────────────

interface WizardProps {
  connector: Connector
  onClose: () => void
}

function ConnectorWizard({ connector, onClose }: WizardProps) {
  const [step, setStep] = useState(1)
  const [apiKey, setApiKey] = useState('')
  const [subdomain, setSubdomain] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[480px] bg-surface-2 border border-border-default rounded-xl shadow-lg animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h2 className="text-title-sm text-text-primary">Conectar {connector.name}</h2>
            <p className="text-body-sm text-text-muted mt-0.5">Passo {step} de 3</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all duration-150"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-accent-bright' : 'bg-surface-4'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-body-lg text-text-primary font-medium mb-1">Autenticacao</h3>
                <p className="text-body-sm text-text-muted">Insira suas credenciais de acesso ao {connector.name}.</p>
              </div>
              <Input
                label="API Key"
                placeholder="Sua chave de API..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              {connector.id === 'conn-hubspot' && (
                <Input
                  label="Subdomain"
                  placeholder="seu-portal"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  hint="Encontrado em Configuracoes > Integracao no painel do HubSpot"
                />
              )}
              <a
                href="#"
                className="flex items-center gap-1.5 text-body-sm text-accent-bright hover:text-accent-light transition-colors duration-150"
                onClick={(e) => e.preventDefault()}
              >
                <ExternalLink size={12} strokeWidth={1.5} />
                Como encontrar minha API Key?
              </a>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-body-lg text-text-primary font-medium mb-1">Configuracao</h3>
                <p className="text-body-sm text-text-muted">Selecione quais objetos sincronizar e a frequencia.</p>
              </div>
              {['Contatos', 'Negocios', 'Atividades', 'Pipeline'].map((obj) => (
                <label key={obj} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 rounded bg-accent-subtle border border-accent-default flex items-center justify-center">
                    <CheckCircle2 size={10} strokeWidth={2} className="text-accent-bright" />
                  </div>
                  <span className="text-body-sm text-text-secondary group-hover:text-text-primary transition-colors duration-150">{obj}</span>
                </label>
              ))}
              <div className="pt-2">
                <p className="text-label-md text-text-muted uppercase tracking-wider mb-2">Frequencia de Sincronizacao</p>
                <div className="flex gap-2">
                  {['15 min', '1 hora', '6 horas', 'Diario'].map((freq) => (
                    <button
                      key={freq}
                      className={`px-3 py-1.5 rounded-md text-body-sm border transition-all duration-150 ${
                        freq === '1 hora'
                          ? 'bg-accent-subtle border-accent-default/30 text-accent-light'
                          : 'bg-surface-3 border-border-default text-text-secondary hover:border-border-strong'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-body-lg text-text-primary font-medium mb-1">Mapeamento de Campos</h3>
                <p className="text-body-sm text-text-muted">Confirme como os campos serao mapeados para o schema Cortex.</p>
              </div>
              <div className="space-y-2">
                {[
                  { source: 'contact.email', target: 'customer.email' },
                  { source: 'contact.firstname + lastname', target: 'customer.full_name' },
                  { source: 'company.name', target: 'account.company_name' },
                  { source: 'deal.amount', target: 'transaction.value' },
                  { source: 'deal.closedate', target: 'transaction.closed_at' },
                ].map((mapping) => (
                  <div key={mapping.source} className="flex items-center gap-2 text-body-sm">
                    <span className="text-text-muted font-mono bg-surface-3 px-2 py-0.5 rounded text-label-sm flex-1 truncate">{mapping.source}</span>
                    <ArrowRight size={12} strokeWidth={1.5} className="text-text-muted flex-shrink-0" />
                    <span className="text-accent-light font-mono bg-accent-subtle px-2 py-0.5 rounded text-label-sm flex-1 truncate">{mapping.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-subtle flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            {step > 1 ? 'Voltar' : 'Cancelar'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={step < 3 ? <ChevronRight size={14} strokeWidth={1.5} /> : <CheckCircle2 size={14} strokeWidth={1.5} />}
            iconPosition="right"
            onClick={() => step < 3 ? setStep(step + 1) : onClose()}
          >
            {step < 3 ? 'Continuar' : 'Conectar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Connector Card ────────────────────────────────────────────────────────────

function ConnectorCard({ connector, onConnect }: { connector: Connector; onConnect: (c: Connector) => void }) {
  const config = statusConfig[connector.status]
  const isComingSoon = connector.status === 'coming-soon'

  return (
    <Card
      padding="md"
      hoverable={!isComingSoon}
      className={isComingSoon ? 'opacity-60' : ''}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Icon placeholder */}
        <div className="w-10 h-10 rounded-lg bg-surface-3 border border-border-default flex items-center justify-center flex-shrink-0">
          <Plug size={16} strokeWidth={1.5} className="text-text-muted" />
        </div>
        <Badge variant={config.badge} dot={config.dot}>
          {config.label}
        </Badge>
      </div>

      <h3 className="text-title-sm text-text-primary mb-1">{connector.name}</h3>
      <p className="text-body-sm text-text-muted mb-3 line-clamp-2">{connector.description}</p>

      <div className="flex items-center gap-1.5 mb-4">
        <Badge variant="neutral">{connector.category}</Badge>
        <Badge variant="neutral">Wave {connector.wave}</Badge>
      </div>

      {connector.status === 'connected' && (
        <div className="flex items-center justify-between text-label-sm text-text-muted border-t border-border-subtle pt-3">
          <div className="flex items-center gap-1.5">
            <RefreshCw size={10} strokeWidth={1.5} />
            <span>Ultima sinc: {formatSyncTime(connector.lastSync)}</span>
          </div>
          <span>{formatRecords(connector.recordsSynced)} registros</span>
        </div>
      )}

      {(connector.status === 'available' || connector.status === 'connecting') && (
        <Button
          variant={connector.status === 'connecting' ? 'secondary' : 'primary'}
          size="sm"
          className="w-full mt-1"
          loading={connector.status === 'connecting'}
          onClick={() => onConnect(connector)}
        >
          {connector.status === 'connecting' ? 'Conectando...' : 'Conectar'}
        </Button>
      )}

      {connector.status === 'coming-soon' && (
        <Button variant="secondary" size="sm" className="w-full mt-1" disabled>
          Em Breve
        </Button>
      )}
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ConnectorsPage() {
  const [wizardConnector, setWizardConnector] = useState<Connector | null>(null)
  const [filter, setFilter] = useState<ConnectorStatus | 'all'>('all')

  const filtered = filter === 'all'
    ? connectors
    : connectors.filter((c) => c.status === filter)

  const counts = {
    connected: connectors.filter((c) => c.status === 'connected').length,
    connecting: connectors.filter((c) => c.status === 'connecting').length,
    available: connectors.filter((c) => c.status === 'available').length,
    'coming-soon': connectors.filter((c) => c.status === 'coming-soon').length,
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Conectores" subtitle="Bibliotea de integrações de dados" />

      <div className="p-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Conectados', count: counts.connected, variant: 'success' as const },
            { label: 'Conectando', count: counts.connecting, variant: 'warning' as const },
            { label: 'Disponiveis', count: counts.available, variant: 'info' as const },
            { label: 'Em Breve', count: counts['coming-soon'], variant: 'neutral' as const },
          ].map((stat) => (
            <Card key={stat.label} padding="sm" className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-label-md text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className="text-title-lg text-text-primary mt-0.5">{stat.count}</p>
              </div>
              <Badge variant={stat.variant} dot={stat.variant !== 'neutral'}>
                {stat.variant === 'success' ? 'Ativo' : stat.variant === 'warning' ? 'Sync' : stat.variant === 'info' ? 'Pronto' : 'Breve'}
              </Badge>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'connected', label: 'Conectados' },
            { value: 'available', label: 'Disponiveis' },
            { value: 'coming-soon', label: 'Em breve' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as ConnectorStatus | 'all')}
              className={`px-3 py-1.5 rounded-md text-body-sm border transition-all duration-150 ${
                filter === tab.value
                  ? 'bg-accent-subtle border-accent-default/30 text-accent-light'
                  : 'bg-surface-2 border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4 xl:grid-cols-4">
          {filtered.map((connector) => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              onConnect={(c) => setWizardConnector(c)}
            />
          ))}
        </div>
      </div>

      {/* Wizard Modal */}
      {wizardConnector && (
        <ConnectorWizard
          connector={wizardConnector}
          onClose={() => setWizardConnector(null)}
        />
      )}
    </div>
  )
}
