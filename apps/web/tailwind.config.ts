import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base': '#0A0A0C',
        'surface-1': '#111114',
        'surface-2': '#18181C',
        'surface-3': '#1E1E23',
        'surface-4': '#26262B',
        // Borders
        'border-subtle': '#26262B',
        'border-default': '#313138',
        'border-strong': '#3F3F47',
        // Text
        'text-primary': '#F4F4F5',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
        'text-disabled': '#3F3F47',
        // Accent - Emerald
        'accent-subtle': '#052E16',
        'accent-muted': '#064E3B',
        'accent-default': '#059669',
        'accent-bright': '#10B981',
        'accent-light': '#6EE7B7',
        // Status
        'status-success': '#10B981',
        'status-success-bg': '#052E16',
        'status-warning': '#F59E0B',
        'status-warning-bg': '#1C1100',
        'status-danger': '#EF4444',
        'status-danger-bg': '#1C0000',
        'status-info': '#6366F1',
        'status-info-bg': '#0F0F2E',
        'status-neutral': '#71717A',
        'status-neutral-bg': '#111114',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '700' }],
        'title-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-md': ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.015em', fontWeight: '600' }],
        'title-sm': ['1rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['0.9375rem', { lineHeight: '1.6' }],
        'body-md': ['0.875rem', { lineHeight: '1.57' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.54' }],
        'label-md': ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.27', letterSpacing: '0.02em', fontWeight: '500' }],
        'mono-sm': ['0.8125rem', { lineHeight: '1.5', fontFamily: 'mono' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.4)',
        'md': '0 4px 12px rgba(0,0,0,0.5)',
        'lg': '0 8px 32px rgba(0,0,0,0.6)',
        'accent': '0 0 0 1px rgba(16,185,129,0.4), 0 0 12px rgba(16,185,129,0.08)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'slide-in': 'slide-in 200ms ease-out',
      },
    },
  },
  plugins: [],
}

export default config
