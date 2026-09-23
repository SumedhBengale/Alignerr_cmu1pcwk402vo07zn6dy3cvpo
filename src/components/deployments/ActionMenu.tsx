import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  RotateCcw,
  Terminal,
  Undo2,
} from 'lucide-react'
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

export function ActionMenu({ deployment }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const anchor = rootRef.current?.getBoundingClientRect()
      const menu = menuRef.current
      if (!anchor || !menu) return
      const gap = 4
      const margin = 8
      const height = menu.offsetHeight
      const below = anchor.bottom + gap
      const top = below + height <= window.innerHeight - margin
        ? below
        : anchor.top - gap - height
      setPosition({
        top: Math.max(margin, Math.min(top, window.innerHeight - height - margin)),
        left: Math.max(margin, Math.min(anchor.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - margin)),
      })
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        rootRef.current?.querySelector('button')?.focus()
      }
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

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

      {open && createPortal(
        <div
          ref={menuRef}
          style={position}
          role="menu"
          aria-label={`Actions for ${deployment.id}`}
          className="fixed z-50 max-h-[calc(100dvh-1rem)] w-52 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
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
        </div>,
        document.body,
      )}
    </div>
  )
}