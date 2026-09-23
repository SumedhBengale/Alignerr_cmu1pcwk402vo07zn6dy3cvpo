import { useRef, useState } from 'react'
import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  RotateCcw,
  Terminal,
  Undo2,
} from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'
import type { Deployment } from '../../lib/types'

interface ActionMenuProps {
  deployment: Deployment
}

type ActionKind = 'logs' | 'retry' | 'share' | 'rollback' | 'details'

const ACTIONS: { kind: ActionKind; label: string; icon: typeof Copy }[] = [
  { kind: 'logs', label: 'View build logs', icon: Terminal },
  { kind: 'retry', label: 'Retry deployment', icon: RotateCcw },
  { kind: 'share', label: 'Copy deployment link', icon: Copy },
  { kind: 'rollback', label: 'Open rollback plan', icon: Undo2 },
  { kind: 'details', label: 'View run details', icon: ExternalLink },
]

/**
 * Three-dot row action menu for the deployments table.
 *
 * NOTE: the menu is rendered inline (position: absolute) and relies on the
 * nearest positioned ancestor for stacking — no createPortal is used.
 */
export function ActionMenu({ deployment }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  useClickOutside(rootRef, () => setOpen(false), open)

  return (
    <div ref={rootRef} className="relative inline-flex items-center justify-end">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for deployment ${deployment.id}`}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 ${
          open ? 'bg-slate-100 text-slate-700' : ''
        }`}
      >
        <MoreHorizontal className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={`Actions for ${deployment.id}`}
          className="absolute right-0 top-9 z-50 w-52 animate-fade-in overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          <p className="px-3 pb-1 pt-1.5 font-mono text-[11px] text-slate-400">
            {deployment.serviceName} · {deployment.commit}
          </p>
          {ACTIONS.map(({ kind, label, icon: Icon }) => (
            <button
              key={kind}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                kind === 'details'
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}