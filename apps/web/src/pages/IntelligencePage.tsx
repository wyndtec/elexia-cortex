import React, { useState, useRef, useEffect } from 'react'
import { Send, Zap, RotateCcw } from 'lucide-react'
import { TopBar } from '../components/ui/TopBar'
import { Badge } from '../components/ui/Badge'
import { initialChatMessages, chatPresets, chatResponses } from '../data/mock'
import type { ChatMessage } from '../data/mock'

// ─── Mini Table ───────────────────────────────────────────────────────────────

function InlineTable({ rows }: { rows: Record<string, string | number>[] }) {
  if (!rows.length) return null
  const keys = Object.keys(rows[0])

  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-border-subtle">
      <table className="w-full text-body-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-3/50">
            {keys.map((k) => (
              <th key={k} className="px-3 py-2 text-left text-label-md text-text-muted uppercase tracking-wider font-medium">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-border-subtle/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-surface-3/20'}`}>
              {keys.map((k) => (
                <td key={k} className="px-3 py-2 text-text-secondary">
                  {String(row[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Metric Block ─────────────────────────────────────────────────────────────

interface MetricPayload {
  value: string
  change: string
  period: string
  breakdown?: { label: string; value: string }[]
}

function InlineMetric({ data }: { data: MetricPayload }) {
  return (
    <div className="mt-3 bg-surface-3 border border-border-subtle rounded-lg p-4">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-display text-text-primary">{data.value}</span>
        <span className="text-body-sm text-status-success">{data.change} {data.period}</span>
      </div>
      {data.breakdown && (
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border-subtle">
          {data.breakdown.map((b) => (
            <div key={b.label}>
              <p className="text-label-sm text-text-muted">{b.label}</p>
              <p className="text-body-sm text-text-primary font-medium font-mono mt-0.5">{b.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent-subtle border border-accent-default/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap size={12} strokeWidth={1.5} className="text-accent-bright" />
        </div>
      )}

      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isUser && (
          <span className="text-label-sm text-text-muted px-1">Cortex Intelligence</span>
        )}

        <div className={`
          rounded-xl px-4 py-3
          ${isUser
            ? 'bg-accent-subtle border border-accent-default/20 text-accent-light rounded-tr-sm'
            : 'bg-surface-2 border border-border-subtle text-text-secondary rounded-tl-sm'
          }
        `}>
          <p className="text-body-md leading-relaxed">{message.content}</p>

          {/* Inline data */}
          {message.data?.type === 'table' && (
            <InlineTable rows={message.data.payload as Record<string, string | number>[]} />
          )}
          {message.data?.type === 'metric' && (
            <InlineMetric data={message.data.payload as MetricPayload} />
          )}
        </div>

        <span className="text-label-sm text-text-muted px-1">
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-surface-3 border border-border-default flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-label-sm text-text-secondary font-medium">WO</span>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function IntelligencePage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate response delay
    setTimeout(() => {
      const responseTemplate = chatResponses[text]
      const response: ChatMessage = responseTemplate
        ? {
            ...responseTemplate,
            id: `resp-${Date.now()}`,
            timestamp: new Date().toISOString(),
          }
        : {
            id: `resp-${Date.now()}`,
            role: 'assistant',
            content: `Analisando sua consulta sobre "${text}"... Processando dados da base de ${5} clientes e ${2} conectores ativos. Para resultados mais precisos, certifique-se de que todos os conectores necessarios estao sincronizados.`,
            timestamp: new Date().toISOString(),
          }

      setIsTyping(false)
      setMessages((prev) => [...prev, response])
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleReset = () => {
    setMessages(initialChatMessages)
    setInput('')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar
        title="Cortex Intelligence"
        subtitle="Perguntas em linguagem natural sobre seus dados"
        actions={
          <button
            onClick={handleReset}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border-default bg-surface-2 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all duration-150"
          >
            <RotateCcw size={14} strokeWidth={1.5} />
          </button>
        }
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {/* Header hint */}
        {messages.length <= 1 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-accent-subtle border border-accent-default/30 flex items-center justify-center mx-auto mb-4">
              <Zap size={22} strokeWidth={1.5} className="text-accent-bright" />
            </div>
            <h2 className="text-title-md text-text-primary mb-2">Cortex Intelligence</h2>
            <p className="text-body-md text-text-muted max-w-md mx-auto">
              Acesso direto a Customer 360, metricas de receita, scores preditivos e audit logs. Pergunte em portugues.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-accent-subtle border border-accent-default/30 flex items-center justify-center flex-shrink-0">
              <Zap size={12} strokeWidth={1.5} className="text-accent-bright" />
            </div>
            <div className="bg-surface-2 border border-border-subtle rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Presets */}
      {messages.length <= 1 && (
        <div className="px-6 pb-3">
          <p className="text-label-sm text-text-muted uppercase tracking-wider mb-2">Sugestoes</p>
          <div className="flex flex-wrap gap-2">
            {chatPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => sendMessage(preset)}
                className="px-3 py-1.5 bg-surface-2 border border-border-default rounded-md text-body-sm text-text-secondary hover:text-text-primary hover:bg-surface-3 hover:border-border-strong transition-all duration-150"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6 pt-3 border-t border-border-subtle bg-bg-base">
        <div className="flex gap-3 bg-surface-2 border border-border-default rounded-xl p-3 focus-within:border-accent-default focus-within:ring-2 focus-within:ring-accent-default/20 transition-all duration-150">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre seus dados... (Enter para enviar, Shift+Enter para nova linha)"
            className="flex-1 bg-transparent text-body-md text-text-primary placeholder:text-text-muted resize-none focus:outline-none min-h-[40px] max-h-32"
            rows={1}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 self-end
              transition-all duration-150
              ${input.trim() && !isTyping
                ? 'bg-accent-bright text-text-inverse hover:bg-accent-light cursor-pointer'
                : 'bg-surface-3 text-text-muted cursor-not-allowed opacity-50'
              }
            `}
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
        <p className="text-label-sm text-text-muted mt-2 text-center">
          Cortex processa apenas dados do seu tenant — sem compartilhamento externo
        </p>
      </div>
    </div>
  )
}
