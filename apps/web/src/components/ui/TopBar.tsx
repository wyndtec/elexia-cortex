import React, { useState } from 'react'
import { Search, Bell, SlidersHorizontal } from 'lucide-react'
import { Input } from './Input'

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const [query, setQuery] = useState('')

  return (
    <header className="h-14 bg-surface-1/80 backdrop-blur-sm border-b border-border-subtle px-6 flex items-center gap-4 sticky top-0 z-10">
      {/* Title */}
      <div className="flex-shrink-0">
        <h1 className="text-title-sm text-text-primary leading-none">{title}</h1>
        {subtitle && (
          <p className="text-label-sm text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="w-64">
        <Input
          placeholder="Buscar cliente, empresa..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search size={14} strokeWidth={1.5} />}
          iconPosition="left"
          className="h-8 text-body-sm"
        />
      </div>

      {/* Filter */}
      <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border-default bg-surface-2 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all duration-150">
        <SlidersHorizontal size={14} strokeWidth={1.5} />
      </button>

      {/* Notifications */}
      <button className="relative h-8 w-8 flex items-center justify-center rounded-md border border-border-default bg-surface-2 text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all duration-150">
        <Bell size={14} strokeWidth={1.5} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-status-danger" />
      </button>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
