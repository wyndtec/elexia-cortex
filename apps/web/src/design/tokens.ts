// Cortex Design System — Design Tokens
// Single source of truth for all design decisions

export const colors = {
  // Backgrounds
  bgBase: '#0A0A0C',
  surface1: '#111114',
  surface2: '#18181C',
  surface3: '#1E1E23',
  surface4: '#26262B',

  // Borders
  borderSubtle: '#26262B',
  borderDefault: '#313138',
  borderStrong: '#3F3F47',

  // Text
  textPrimary: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textDisabled: '#3F3F47',
  textInverse: '#0A0A0C',

  // Accent — Emerald
  accentSubtle: '#052E16',
  accentMuted: '#064E3B',
  accentDefault: '#059669',
  accentBright: '#10B981',
  accentLight: '#6EE7B7',
  accentGlow: 'rgba(16,185,129,0.12)',

  // Status
  statusSuccess: '#10B981',
  statusSuccessBg: '#052E16',
  statusWarning: '#F59E0B',
  statusWarningBg: '#1C1100',
  statusDanger: '#EF4444',
  statusDangerBg: '#1C0000',
  statusInfo: '#6366F1',
  statusInfoBg: '#0F0F2E',
  statusNeutral: '#71717A',
  statusNeutralBg: '#111114',
} as const

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const

export const fontSize = {
  display: { size: '2rem', weight: 700, lineHeight: 1.2, letterSpacing: '-0.025em' },
  titleLg: { size: '1.5rem', weight: 600, lineHeight: 1.3, letterSpacing: '-0.02em' },
  titleMd: { size: '1.25rem', weight: 600, lineHeight: 1.35, letterSpacing: '-0.015em' },
  titleSm: { size: '1rem', weight: 600, lineHeight: 1.4, letterSpacing: '-0.01em' },
  bodyLg: { size: '0.9375rem', weight: 400, lineHeight: 1.6 },
  bodyMd: { size: '0.875rem', weight: 400, lineHeight: 1.57 },
  bodySm: { size: '0.8125rem', weight: 400, lineHeight: 1.54 },
  labelMd: { size: '0.75rem', weight: 500, lineHeight: 1.33, letterSpacing: '0.01em' },
  labelSm: { size: '0.6875rem', weight: 500, lineHeight: 1.27, letterSpacing: '0.02em' },
} as const

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.4)',
  md: '0 4px 12px rgba(0,0,0,0.5)',
  lg: '0 8px 32px rgba(0,0,0,0.6)',
  accent: '0 0 0 1px rgba(16,185,129,0.4), 0 0 12px rgba(16,185,129,0.08)',
  insetTop: 'inset 0 1px 0 rgba(255,255,255,0.04)',
} as const

export const transitions = {
  fast: '150ms ease',
  default: '200ms ease',
  slow: '300ms ease',
} as const

// Status badge map — health scores
export const healthScoreColor = (score: number): string => {
  if (score >= 75) return 'success'
  if (score >= 45) return 'warning'
  return 'danger'
}

export const churnScoreColor = (score: number): string => {
  if (score <= 25) return 'success'
  if (score <= 55) return 'warning'
  return 'danger'
}
