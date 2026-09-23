import { useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { TEAMS, type Team } from '../../lib/navigation'
import { useClickOutside } from '../../hooks/useClickOutside'

interface TeamSelectorProps {
  team: Team
  onSelectTeam: (team: Team) => void
}

export function TeamSelector({ team, onSelectTeam }: TeamSelectorProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  useClickOutside(rootRef, () => setOpen(false), open)

  return (
    <div ref={rootRef} className="relative px-3 pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-left transition-colors hover:border-slate-300 hover:bg-white"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[11px] font-semibold text-white">
          {team.initials}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
          {team.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-3 right-3 z-10 mt-1.5 animate-fade-in overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Switch team
          </p>
          {TEAMS.map((t) => {
            const selected = t.id === team.id
            return (
              <button
                key={t.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelectTeam(t)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                  selected ? 'text-indigo-700' : 'text-slate-700'
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                  {t.initials}
                </span>
                <span className="flex-1 truncate">{t.name}</span>
                {selected && <Check className="h-4 w-4 shrink-0 text-indigo-600" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}