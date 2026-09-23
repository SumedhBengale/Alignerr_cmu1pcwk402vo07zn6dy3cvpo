import { X } from 'lucide-react'
import type { Team, View } from '../../lib/navigation'
import { LogoMark } from '../ui/LogoMark'
import { NavList } from './NavList'
import { TeamSelector } from './TeamSelector'

interface MobileNavProps {
  open: boolean
  view: View
  team: Team
  onClose: () => void
  onNavigate: (view: View) => void
  onSelectTeam: (team: Team) => void
}

export function MobileNav({
  open,
  view,
  team,
  onClose,
  onNavigate,
  onSelectTeam,
}: MobileNavProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-fade-in flex-col bg-white shadow-xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              PulseMetrics
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <TeamSelector team={team} onSelectTeam={onSelectTeam} />
        <NavList
          view={view}
          onNavigate={(v) => {
            onNavigate(v)
            onClose()
          }}
        />
        <div className="shrink-0 border-t border-slate-100 p-4 text-xs text-slate-400">
          PulseMetrics v1.4.2 · All systems operational
        </div>
      </div>
    </div>
  )
}