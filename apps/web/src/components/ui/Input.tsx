import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function Input({
  label,
  hint,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-label-md text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full bg-surface-2 border rounded-md
            text-body-md text-text-primary placeholder:text-text-muted
            transition-all duration-150
            focus:outline-none
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error
              ? 'border-status-danger focus:border-status-danger focus:ring-2 focus:ring-status-danger/20'
              : 'border-border-default focus:border-accent-default focus:ring-2 focus:ring-accent-default/20'
            }
            ${icon && iconPosition === 'left' ? 'pl-9' : 'pl-3'}
            ${icon && iconPosition === 'right' ? 'pr-9' : 'pr-3'}
            py-2 h-9
            ${className}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center pointer-events-none">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <span className="text-body-sm text-status-danger">{error}</span>
      )}
      {hint && !error && (
        <span className="text-body-sm text-text-muted">{hint}</span>
      )}
    </div>
  )
}
