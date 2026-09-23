import { Rocket, Settings2, TriangleAlert, Undo2 } from 'lucide-react'
import { formatRelativeTime } from '../../lib/format'
import type { ActivityItem } from '../../lib/types'
import { EmptyState } from '../ui/EmptyState'

const KIND_ICONS = {
  deploy: Rocket,
  incident: TriangleAlert,
  rollback: Undo2,
  config: Settings2,
} as const

const TONE_STYLES = {
  success: 'bg-emerald-50 text-emerald-600',
  danger: 'bg-rose-50 text-rose-600',
  warning: 'bg-amber-50 text-amber-600',
  neutral: 'bg-slate-100 text-slate-500',
} as const

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Rocket}
        title="No recent activity"
        description="Deploys, rollbacks, and incidents for this team will show up here."
      />
    )
  }

  return (
    <ol className="relative space-y-0">
      {items.map((item, index) => {
        const Icon = KIND_ICONS[item.kind]
        return (
          <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < items.length - 1 && (
              <span
                className="absolute left-[15px] top-8 h-[calc(100%-18px)] w-px bg-slate-200"
                aria-hidden="true"
              />
            )}
            <span
              className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                TONE_STYLES[item.tone]
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm leading-snug text-slate-700">{item.title}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {item.user} <span aria-hidden="true">·</span> {formatRelativeTime(item.minutesAgo)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}