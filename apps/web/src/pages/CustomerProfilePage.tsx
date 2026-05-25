import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  RefreshCw,
  Calendar,
  MessageSquare,
  Star,
  AlertTriangle,
  Zap,
  ExternalLink,
} from 'lucide-react'
import { TopBar } from '../components/ui/TopBar'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { customers, customerTimeline } from '../data/mock'
import { healthScoreColor } from '../design/tokens'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

function HealthRing({ score }: { score: number }) {
  const color = healthScoreColor(score)
  const strokeColor = { success: '#10B981', warning: '#F59E0B', danger: '#EF4444' }[color]
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#26262B" strokeWidth="4" />
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-title-md text-text-primary">{score}</span>
        <span className="text-label-sm text-text-muted -mt-0.5">saude</span>
      </div>
    </div>
  )
}

const timelineIcons: Record<string, React.ReactNode> = {
  lead: <Star size={12} strokeWidth={1.5} />,
  purchase: <ShoppingCart size={12} strokeWidth={1.5} />,
  support: <MessageSquare size={12} strokeWidth={1.5} />,
  nps: <Star size={12} strokeWidth={1.5} />,
  visit: <ExternalLink size={12} strokeWidth={1.5} />,
  renewal: <RefreshCw size={12} strokeWidth={1.5} />,
  'churn-signal': <AlertTriangle size={12} strokeWidth={1.5} />,
}

const timelineColors: Record<string, string> = {
  lead: 'border-status-info bg-status-info-bg text-status-info',
  purchase: 'border-status-success bg-status-success-bg text-status-success',
  support: 'border-border-default bg-surface-3 text-text-muted',
  nps: 'border-status-warning bg-status-warning-bg text-status-warning',
  visit: 'border-border-default bg-surface-3 text-text-muted',
  renewal: 'border-accent-default bg-accent-subtle text-accent-light',
  'churn-signal': 'border-status-danger bg-status-danger-bg text-status-danger',
}

// Churn factors (SHAP-style)
const churnFactors = [
  { label: 'Dias sem atividade', impact: 0.34, direction: 'negative' as const },
  { label: 'Reducao em ticket medio', impact: 0.28, direction: 'negative' as const },
  { label: 'NPS declinio (-3 pts)', impact: 0.18, direction: 'negative' as const },
  { label: 'Sem renovacao em vista', impact: 0.12, direction: 'negative' as const },
  { label: 'Uso de features criticas', impact: 0.08, direction: 'positive' as const },
]

export function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const customer = customers.find((c) => c.id === id) || customers[0]
  const timeline = customerTimeline[customer.id] || []
  const healthColor = healthScoreColor(customer.healthScore)

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar
        title={customer.company}
        subtitle={`${customer.name} · ${customer.segment.join(', ')}`}
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={14} strokeWidth={1.5} />}
              onClick={() => navigate('/')}
            >
              Voltar
            </Button>
            <Button variant="primary" size="sm">
              Criar Tarefa
            </Button>
          </>
        }
      />

      <div className="p-6 animate-fade-in">
        {/* Header Card */}
        <Card padding="md" className="mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-xl bg-surface-3 border border-border-default flex items-center justify-center flex-shrink-0">
              <span className="text-title-lg text-text-secondary">{customer.name.charAt(0)}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-1">
                <h1 className="text-title-lg text-text-primary">{customer.name}</h1>
                <Badge variant={healthColor as 'success' | 'warning' | 'danger'} dot>
                  {healthColor === 'success' ? 'Saudavel' : healthColor === 'warning' ? 'Em risco' : 'Critico'}
                </Badge>
              </div>
              <p className="text-body-md text-text-secondary mb-3">{customer.company}</p>
              <div className="flex flex-wrap gap-1.5">
                {customer.segment.map((tag) => (
                  <Badge key={tag} variant="neutral">{tag}</Badge>
                ))}
                {customer.sources.map((src) => (
                  <Badge key={src} variant="info">{src}</Badge>
                ))}
              </div>
            </div>

            {/* Health Ring */}
            <HealthRing score={customer.healthScore} />
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column — KPIs + AI */}
          <div className="col-span-1 space-y-5">
            {/* KPIs */}
            <Card padding="md">
              <CardHeader title="Metricas" className="mb-4" />
              <div className="space-y-3">
                {[
                  { label: 'LTV Total', value: formatCurrency(customer.ltv), icon: <TrendingUp size={14} strokeWidth={1.5} /> },
                  { label: 'Ticket Medio', value: formatCurrency(customer.ticketMedio), icon: <ShoppingCart size={14} strokeWidth={1.5} /> },
                  { label: 'Compras / ano', value: customer.frequencia, icon: <RefreshCw size={14} strokeWidth={1.5} /> },
                  { label: 'Dias sem comprar', value: customer.diasSemComprar, icon: <Calendar size={14} strokeWidth={1.5} /> },
                  { label: 'NPS', value: customer.nps !== null ? `${customer.nps}/10` : 'N/A', icon: <Star size={14} strokeWidth={1.5} /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-muted">
                      {item.icon}
                      <span className="text-body-sm">{item.label}</span>
                    </div>
                    <span className="text-body-sm text-text-primary font-medium font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI — Churn Prediction */}
            <Card padding="md" className="border-accent-default/20">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} strokeWidth={1.5} className="text-accent-bright" />
                <h3 className="text-title-sm text-text-primary">Cortex Intelligence</h3>
              </div>

              {/* Churn Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-label-md text-text-muted uppercase tracking-wider">Risco de Churn</span>
                  <span className={`text-title-sm font-mono ${customer.churnScore > 55 ? 'text-status-danger' : customer.churnScore > 25 ? 'text-status-warning' : 'text-status-success'}`}>
                    {customer.churnScore}%
                  </span>
                </div>
                <div className="h-1.5 bg-surface-4 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${customer.churnScore > 55 ? 'bg-status-danger' : customer.churnScore > 25 ? 'bg-status-warning' : 'bg-status-success'}`}
                    style={{ width: `${customer.churnScore}%` }}
                  />
                </div>
              </div>

              {/* SHAP factors */}
              <div className="space-y-2 mb-4">
                <p className="text-label-sm text-text-muted uppercase tracking-wider mb-2">Fatores Principais</p>
                {churnFactors.map((factor) => (
                  <div key={factor.label} className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-surface-4 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${factor.direction === 'negative' ? 'bg-status-danger' : 'bg-status-success'}`}
                        style={{ width: `${factor.impact * 100}%` }}
                      />
                    </div>
                    <span className="text-label-sm text-text-muted w-36 truncate">{factor.label}</span>
                  </div>
                ))}
              </div>

              {/* Next Action */}
              <div className="bg-accent-subtle border border-accent-default/20 rounded-lg p-3">
                <p className="text-label-sm text-accent-light/70 uppercase tracking-wider mb-1">Proxima Acao Recomendada</p>
                <p className="text-body-sm text-accent-light">{customer.nextAction}</p>
              </div>
            </Card>
          </div>

          {/* Right column — Timeline */}
          <div className="col-span-2">
            <Card padding="md">
              <CardHeader title="Timeline de Interacoes" subtitle={`${timeline.length} eventos registrados`} className="mb-5" />

              {timeline.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-text-muted text-body-md">Nenhum evento registrado para este cliente.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-border-subtle" />

                  <div className="space-y-4">
                    {[...timeline].reverse().map((event) => (
                      <div key={event.id} className="flex gap-4 pl-0.5">
                        {/* Icon dot */}
                        <div className={`
                          w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0
                          z-10 relative
                          ${timelineColors[event.type]}
                        `}>
                          {timelineIcons[event.type]}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-body-sm text-text-primary font-medium">{event.title}</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {event.value !== undefined && (
                                <span className="text-label-sm text-accent-light font-mono">
                                  {event.type === 'nps' ? `${event.value}/10` : formatCurrency(event.value)}
                                </span>
                              )}
                              <span className="text-label-sm text-text-muted">
                                {new Date(event.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <p className="text-body-sm text-text-muted mt-0.5">{event.description}</p>
                          <Badge variant="neutral" className="mt-1.5">{event.source}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
