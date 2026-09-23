import { NAV_ITEMS, type View } from '../../lib/navigation'

interface NavListProps {
  view: View
  onNavigate: (view: View) => void
}

export function NavList({ view, onNavigate }: NavListProps) {
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      <p className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Main
      </p>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = view === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] shrink-0 ${
                active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            <span className="flex-1 truncate text-left">{label}</span>
            {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />}
          </button>
        )
      })}
    </nav>
  )
}