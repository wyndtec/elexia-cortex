import React, { useState } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  AlertTriangle,
  Lock,
  FileText,
  Eye,
  Database,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { TopBar } from '../components/ui/TopBar'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { auditLog, piiInventory } from '../data/mock'

// ─── Compliance Status Card ────────────────────────────────────────────────────

interface ComplianceFramework {
  name: string
  status: 'compliant' | 'in-progress' | 'planned'
  description: string
  progress?: number
  items: string[]
}

const frameworks: ComplianceFramework[] = [
  {
    name: 'LGPD',
    status: 'compliant',
    description: 'Lei Geral de Protecao de Dados — BR',
    progress: 100,
    items: [
      'Consentimento por design implementado',
      'Direito de acesso e exclusao ativo',
      'DPO designado internamente',
      'Inventario de dados atualizado',
      'Contratos com fornecedores revisados',
    ],
  },
  {
    name: 'SOC 2 Type II',
    status: 'in-progress',
    description: 'Security, Availability, Confidentiality',
    progress: 68,
    items: [
      'Controles de acesso documentados',
      'Monitoramento 24/7 ativo',
      'Plano de resposta a incidentes rascunhado',
      'Auditoria formal agendada para Q3/2026',
    ],
  },
  {
    name: 'ISO 27001',
    status: 'planned',
    description: 'Information Security Management',
    progress: 15,
    items: [
      'Gap analysis iniciado',
      'Roadmap de implementacao previsto para Q4/2026',
    ],
  },
]

const frameworkConfig = {
  compliant: { badge: 'success' as const, icon: <ShieldCheck size={16} strokeWidth={1.5} />, label: 'Conforme' },
  'in-progress': { badge: 'warning' as const, icon: <Clock size={16} strokeWidth={1.5} />, label: 'Em progresso' },
  planned: { badge: 'neutral' as const, icon: <ShieldAlert size={16} strokeWidth={1.5} />, label: 'Planejado' },
}

function FrameworkCard({ fw }: { fw: ComplianceFramework }) {
  const [expanded, setExpanded] = useState(false)
  const config = frameworkConfig[fw.status]

  return (
    <Card padding="md">
      <div className="flex items-start gap-4">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
          ${fw.status === 'compliant' ? 'bg-status-success-bg text-status-success' :
            fw.status === 'in-progress' ? 'bg-status-warning-bg text-status-warning' :
            'bg-surface-3 text-text-muted'}
        `}>
          {config.icon}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="text-title-sm text-text-primary">{fw.name}</h3>
              <p className="text-body-sm text-text-muted">{fw.description}</p>
            </div>
            <Badge variant={config.badge}>{config.label}</Badge>
          </div>

          {fw.progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-label-sm text-text-muted">Progresso</span>
                <span className="text-label-sm text-text-primary font-medium">{fw.progress}%</span>
              </div>
              <div className="h-1.5 bg-surface-4 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fw.status === 'compliant' ? 'bg-status-success' :
                    fw.status === 'in-progress' ? 'bg-status-warning' :
                    'bg-text-muted'
                  }`}
                  style={{ width: `${fw.progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            className="flex items-center gap-1 mt-3 text-label-md text-text-muted hover:text-text-secondary transition-colors duration-150"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronDown size={12} strokeWidth={1.5} /> : <ChevronRight size={12} strokeWidth={1.5} />}
            {fw.items.length} itens verificados
          </button>

          {expanded && (
            <ul className="mt-2 space-y-1.5 animate-fade-in">
              {fw.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-body-sm text-text-muted">
                  <ShieldCheck size={12} strokeWidth={1.5} className="text-status-success mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── Audit Entry ──────────────────────────────────────────────────────────────

const severityConfig = {
  info: { badge: 'info' as const, icon: <Eye size={12} strokeWidth={1.5} /> },
  warning: { badge: 'warning' as const, icon: <AlertTriangle size={12} strokeWidth={1.5} /> },
  critical: { badge: 'danger' as const, icon: <Lock size={12} strokeWidth={1.5} /> },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CompliancePage() {
  const alerts = auditLog.filter((e) => e.severity !== 'info')

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar
        title="Compliance & Privacidade"
        subtitle="Painel DPO — LGPD, auditoria e inventario de dados"
      />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert) => {
              const config = severityConfig[alert.severity]
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${
                    alert.severity === 'critical'
                      ? 'bg-status-danger-bg border-status-danger/30'
                      : 'bg-status-warning-bg border-status-warning/30'
                  }`}
                >
                  <span className={alert.severity === 'critical' ? 'text-status-danger mt-0.5' : 'text-status-warning mt-0.5'}>
                    {config.icon}
                  </span>
                  <div className="flex-1">
                    <p className={`text-body-sm font-medium ${alert.severity === 'critical' ? 'text-status-danger' : 'text-status-warning'}`}>
                      {alert.action}
                    </p>
                    <p className="text-body-sm text-text-muted">{alert.resource}</p>
                  </div>
                  <span className="text-label-sm text-text-muted flex-shrink-0">
                    {new Date(alert.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Frameworks */}
          <div className="col-span-1 space-y-4">
            <h2 className="text-title-sm text-text-primary">Frameworks de Compliance</h2>
            {frameworks.map((fw) => (
              <FrameworkCard key={fw.name} fw={fw} />
            ))}
          </div>

          {/* Right side */}
          <div className="col-span-2 space-y-5">
            {/* Audit Log */}
            <Card padding="none">
              <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3">
                <FileText size={16} strokeWidth={1.5} className="text-text-muted" />
                <div className="flex-1">
                  <h2 className="text-title-sm text-text-primary">Audit Log</h2>
                  <p className="text-body-sm text-text-muted mt-0.5">Hash-chained, imutavel — {auditLog.length} entradas recentes</p>
                </div>
                <Badge variant="success" dot>Integro</Badge>
              </div>

              <div className="divide-y divide-border-subtle/50">
                {auditLog.map((entry, index) => {
                  const config = severityConfig[entry.severity]
                  return (
                    <div key={entry.id} className="px-6 py-3 hover:bg-surface-3/30 transition-colors duration-100">
                      <div className="flex items-start gap-3">
                        {/* Index + severity */}
                        <div className="flex-shrink-0 flex items-center gap-2 w-28">
                          <span className="text-label-sm text-text-muted font-mono">{String(auditLog.length - index).padStart(3, '0')}</span>
                          <Badge variant={config.badge}>
                            {entry.severity}
                          </Badge>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-body-sm text-text-primary font-medium">{entry.action}</p>
                            <span className="text-label-sm text-text-muted flex-shrink-0 font-mono">
                              {new Date(entry.timestamp).toLocaleString('pt-BR', {
                                day: '2-digit', month: '2-digit',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-body-sm text-text-muted truncate">{entry.resource}</p>
                          <p className="text-label-sm text-text-muted/60 font-mono mt-0.5">by {entry.agent}</p>
                        </div>
                      </div>

                      {/* Hash chain */}
                      <div className="mt-2 ml-28 flex items-center gap-2">
                        <span className="text-label-sm text-text-muted/40 font-mono">hash</span>
                        <span className="text-label-sm text-text-muted font-mono bg-surface-3 px-1.5 py-0.5 rounded">{entry.hash}</span>
                        <span className="text-label-sm text-text-muted/40">←</span>
                        <span className="text-label-sm text-text-muted/40 font-mono">{entry.previousHash}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* PII Inventory */}
            <Card padding="none">
              <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3">
                <Database size={16} strokeWidth={1.5} className="text-text-muted" />
                <div>
                  <h2 className="text-title-sm text-text-primary">Inventario de Dados Pessoais</h2>
                  <p className="text-body-sm text-text-muted mt-0.5">Campos PII, sistemas de origem e base legal</p>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left px-6 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Campo</th>
                    <th className="text-left px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Sistemas</th>
                    <th className="text-left px-4 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Base Legal LGPD</th>
                    <th className="text-right px-6 py-3 text-label-md text-text-muted uppercase tracking-wider font-medium">Registros</th>
                  </tr>
                </thead>
                <tbody>
                  {piiInventory.map((item, index) => (
                    <tr key={item.field} className={`border-b border-border-subtle/50 last:border-0 ${index % 2 === 0 ? '' : 'bg-surface-2/30'}`}>
                      <td className="px-6 py-3">
                        <span className="text-body-sm text-text-primary font-medium">{item.field}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.systems.map((sys) => (
                            <Badge key={sys} variant="info">{sys}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-body-sm text-text-secondary">{item.legalBasis}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="text-body-sm text-text-muted font-mono">{item.records}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
