import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-accent-bright text-text-inverse font-semibold
    hover:bg-accent-light
    focus:outline-none focus:ring-2 focus:ring-accent-default/50
    active:bg-accent-default
  `,
  secondary: `
    bg-surface-2 text-text-primary border border-border-default
    hover:bg-surface-3 hover:border-border-strong
    focus:outline-none focus:ring-2 focus:ring-accent-default/30
    active:bg-surface-4
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:bg-surface-2 hover:text-text-primary
    focus:outline-none focus:ring-2 focus:ring-accent-default/20
    active:bg-surface-3
  `,
  danger: `
    bg-status-danger-bg text-status-danger border border-status-danger/30
    hover:bg-status-danger/10 hover:border-status-danger/50
    focus:outline-none focus:ring-2 focus:ring-status-danger/30
    active:bg-status-danger/20
  `,
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-label-md gap-1.5 rounded-md',
  md: 'h-9 px-4 text-body-md gap-2 rounded-md',
  lg: 'h-11 px-5 text-body-lg gap-2.5 rounded-lg',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium transition-all duration-150
        cursor-pointer select-none whitespace-nowrap
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
