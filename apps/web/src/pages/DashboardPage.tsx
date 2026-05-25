import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react'
import { TopBar } from '../components/ui/TopBar'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { customers, kpis } from '../data/mock'
import { healthScoreColor, churnScoreColor } from '../design/tokens'

// Sparkline SVG minimal
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 80
  const h = 28
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function ChurnBar({ score }: { score: number }) {
  const color = churnScoreColor(score)
  const barColor = {
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
  }[color]

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-surface-4 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-label-sm text-text-muted w-8">{score}%</span>
    </div>
  )
}

function formatLTV(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`
  return `R$ ${value}`
}

interface KPICardProps {
  label: string
  value: string | number
  change: string
  period: string
  trend: 'up' | 'down'
  icon: React.ReactNode
  positive?: boolean
}

function KPICard({ label, value, change, period, trend, icon, positive = true }: KPICardProps) {
  const isGood = positive ? trend === 'up' : trend === 'down'

  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-label-md text-text-muted uppercase tracking-wider mb-3">{label}</p>
          <p className="text-display text-text-primary">{value}</p>
          <div className="flex items-center gap-1.5 mt-2">
            {trend === 'up' ? (
              <ArrowUpRight size={12} strokeWidth={2} className={isGood ? 'text-status-success' : 'text-status-danger'} />
            ) : (
              <ArrowDownRight size={12} strokeWidth={2} className={isGood ? 'text-status-success' : 'text-status-danger'} />
            )}
            <span className={`text-label-sm font-medium ${isGood ? 'text-status-success' : 'text-status-danger'}`}>
              {change}
            </span>
            <span className="text-label-sm text-text-muted">{period}</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-surface-3 border border-border-subtle flex items-center justify-center text-text-muted flex-shrink-0">
          {icon}
        </div>
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar
        title="Customer 360"
        subtitle="Visão consolidada de toda a base"
        actions={
          <Button variant="primary" size="sm">
            Exportar
          </Button>
        }
      />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            label="Clientes Ativos"
            value={kpis.clientesAtivos.value}
            change={kpis.clientesAtivos.change}
            period={kpis.clientesAtivos.period}
            trend={kpis.clientesAtivos.trend}
            icon={<Users size={16} strokeWidth={1.5} />}
            positive={true}
          />
          <KPICard
            label="Churn Risk Alto"
            value={kpis.churnRiskAlto.value}
            change={kpis.churnRiskAlto.change}
            period={kpis.churnRiskAlto.period}
            trend={kpis.churnRiskAlto.trend}
            icon={<AlertTriangle size={16} strokeWidth={1.5} />}
            positive={false}
          />
          <KPICard
            label="LTV Medio"
            value={formatLTV(kpis.ltvMedio.value)}
            change={kpis.ltvMedio.change}
            period={kpis.ltvMedio.period}
            trend={kpis.ltvMedio.trend}
            icon={<TrendingUp size={16} strokeWidth={1.5} />}
            positive={true}
          />
          <KPICard
            label="NRR"
            value={`${kpis.nrr.value}%`}
            change={kpis.nrr.change}
            period={kpis.nrr.period}
            trend={kpis.nrr.trend}
            icon={<BarChart3 size={16} strokeWidth={1.5} />}
            positive={true}
          />
        </div>

        {/* Customer Table */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h2 className="text-title-sm text-text-primary">Base de Clientes</h2>
              <p className="text-body-sm text-text-muted mt-0.5">{customers.length} clientes ativos — ordenado por risco</p>
            </div>
            <Button variant="ghost" size="sm" icon={<ChevronRight size={14} strokeWidth={1.5} />} iconPosition="right">
              Ver todos
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left px-6 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Saude</th>
                  <th className="text-left px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Churn Score</th>
                  <th className="text-right px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">LTV</th>
                  <th className="text-left px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Tendencia</th>
                  <th className="text-left px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Ultimo Contato</th>
                  <th className="text-left px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Proxima Acao</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {customers
                  .sort((a, b) => b.churnScore - a.churnScore)
                  .map((customer, index) => {
                    const healthColor = healthScoreColor(customer.healthScore)
                    const sparkColorMap: Record<string, string> = {
                      success: '#10B981',
                      warning: '#F59E0B',
                      danger: '#EF4444',
                    }
                    const sparkColor = sparkColorMap[healthColor] ?? '#71717A'

                    return (
                      <tr
                        key={customer.id}
                        className={`
                          border-b border-border-subtle/50 last:border-0
                          hover:bg-surface-3 cursor-pointer transition-colors duration-100
                          ${index % 2 === 0 ? 'bg-transparent' : 'bg-surface-2/30'}
                        `}
                        onClick={() => navigate(`/customer/${customer.id}`)}
                      >
                        {/* Cliente */}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-surface-3 border border-border-default flex items-center justify-center flex-shrink-0">
                              <span className="text-label-sm text-text-secondary font-medium">
                                {customer.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-body-sm text-text-primary font-medium leading-none">{customer.name}</p>
                              <p className="text-label-sm text-text-muted mt-0.5">{customer.company}</p>
                            </div>
                          </div>
                        </td>

                        {/* Health */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <Badge variant={healthColor as 'success' | 'warning' | 'danger'} dot>
                              {customer.healthScore}
                            </Badge>
                          </div>
                        </td>

                        {/* Churn */}
                        <td className="px-4 py-3.5">
                          <ChurnBar score={customer.churnScore} />
                        </td>

                        {/* LTV */}
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-body-sm text-text-primary font-medium font-mono">
                            {formatLTV(customer.ltv)}
                          </span>
                        </td>

                        {/* Sparkline */}
                        <td className="px-4 py-3.5">
                          <Sparkline data={customer.sparkline} color={sparkColor} />
                        </td>

                        {/* Last Contact */}
                        <td className="px-4 py-3.5">
                          <span className="text-body-sm text-text-muted">
                            {new Date(customer.lastContact).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                        </td>

                        {/* Next Action */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="text-body-sm text-text-secondary truncate" title={customer.nextAction}>
                            {customer.nextAction}
                          </p>
                        </td>

                        {/* Arrow */}
                        <td className="px-4 py-3.5">
                          <ChevronRight size={14} strokeWidth={1.5} className="text-text-muted opacity-40" />
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
