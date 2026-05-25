import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Plug,
  Brain,
  Shield,
  Settings,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Customer 360',
    path: '/',
    icon: <LayoutDashboard size={16} strokeWidth={1.5} />,
  },
  {
    label: 'Perfil de Cliente',
    path: '/customer/cust-001',
    icon: <Users size={16} strokeWidth={1.5} />,
  },
  {
    label: 'Conectores',
    path: '/connectors',
    icon: <Plug size={16} strokeWidth={1.5} />,
  },
  {
    label: 'Intelligence',
    path: '/intelligence',
    icon: <Brain size={16} strokeWidth={1.5} />,
  },
  {
    label: 'Compliance',
    path: '/compliance',
    icon: <Shield size={16} strokeWidth={1.5} />,
  },
]

export function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-surface-1 border-r border-border-subtle flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent-subtle border border-accent-default/30 flex items-center justify-center">
            <span className="text-accent-light font-mono text-xs font-semibold tracking-tight">Cx</span>
          </div>
          <div>
            <span className="text-title-sm text-text-primary block leading-none">Cortex</span>
            <span className="text-label-sm text-text-muted block mt-0.5">by Elexia</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="mb-1">
          <p className="px-2 mb-2 text-label-sm text-text-muted uppercase tracking-wider">Plataforma</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-2 py-2 rounded-md
                    text-body-sm transition-all duration-150
                    group
                    ${isActive
                      ? 'bg-accent-subtle text-accent-light border border-accent-default/20'
                      : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                    }
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  <ChevronRight
                    size={12}
                    strokeWidth={1.5}
                    className="opacity-0 group-hover:opacity-40 transition-opacity duration-150"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border-subtle">
        <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-body-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-all duration-150">
          <Settings size={16} strokeWidth={1.5} />
          <span>Configurações</span>
        </button>
        {/* Avatar */}
        <div className="flex items-center gap-2.5 px-2 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-accent-subtle border border-accent-default/30 flex items-center justify-center flex-shrink-0">
            <span className="text-label-sm text-accent-light font-semibold">WO</span>
          </div>
          <div className="min-w-0">
            <p className="text-body-sm text-text-primary truncate leading-none">Wyndson</p>
            <p className="text-label-sm text-text-muted truncate mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
