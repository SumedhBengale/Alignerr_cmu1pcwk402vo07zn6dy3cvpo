import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NAV_ITEMS, type Team, type View } from '../../lib/navigation'
import { LogoMark } from '../ui/LogoMark'
import { NavList } from './NavList'
import { TeamSelector } from './TeamSelector'

interface SidebarProps {
  view: View
  collapsed: boolean
  team: Team
  onNavigate: (view: View) => void
  onToggleCollapsed: () => void
  onSelectTeam: (team: Team) => void
}

export function Sidebar({
  view,
  collapsed,
  team,
  onNavigate,
  onToggleCollapsed,
  onSelectTeam,
}: SidebarProps) {
  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-out lg:flex ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div
        className={`flex h-14 shrink-0 items-center border-b border-slate-100 ${
          collapsed ? 'justify-center px-2' : 'px-4'
        }`}
      >
        <LogoMark className="h-8 w-8" />
        {!collapsed && (
          <span className="ml-2.5 truncate text-[15px] font-semibold tracking-tight text-slate-900">
            PulseMetrics
          </span>
        )}
      </div>

      <TeamSelector team={team} onSelectTeam={onSelectTeam} />

      {collapsed ? (
        <NavCollapsed view={view} onNavigate={onNavigate} />
      ) : (
        <NavList view={view} onNavigate={onNavigate} />
      )}

      <div className="shrink-0 border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onToggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

function NavCollapsed({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto py-4">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = view === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            title={label}
            aria-label={label}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              active
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        )
      })}
    </nav>
  )
}