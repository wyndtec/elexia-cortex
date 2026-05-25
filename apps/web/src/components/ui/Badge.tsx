import React from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-status-success-bg text-status-success border border-status-success/20',
  warning: 'bg-status-warning-bg text-status-warning border border-status-warning/20',
  danger: 'bg-status-danger-bg text-status-danger border border-status-danger/20',
  info: 'bg-status-info-bg text-status-info border border-status-info/20',
  neutral: 'bg-status-neutral-bg text-text-muted border border-border-subtle',
  accent: 'bg-accent-subtle text-accent-light border border-accent-default/20',
}

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  info: 'bg-status-info',
  neutral: 'bg-text-muted',
  accent: 'bg-accent-bright',
}

export function Badge({ variant = 'neutral', children, className = '', dot = false }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5
        text-label-md rounded-sm font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  )
}
