import { Tag } from 'lucide-react'
import type { ProjectHealthItem } from '../../lib/types'
import { EmptyState } from '../ui/EmptyState'
import { ServiceStatusIndicator } from '../ui/StatusBadges'

interface ProjectHealthListProps {
  items: ProjectHealthItem[]
}

export function ProjectHealthList({ items }: ProjectHealthListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Tag}
        title="No projects found"
        description="Services for the selected team will appear here once they are registered."
      />
    )
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((project) => (
        <li
          key={project.serviceId}
          className="flex items-center gap-3 px-1 py-3 first:pt-1 last:pb-1"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-sm font-medium text-slate-800">{project.name}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{project.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600 sm:inline-flex">
              <Tag className="h-3 w-3" />
              v{project.version}
            </span>
            <span className="hidden w-16 text-right text-xs tabular-nums text-slate-500 md:block">
              {project.uptimePct30d.toFixed(2)}% up
            </span>
            <ServiceStatusIndicator status={project.status} />
          </div>
        </li>
      ))}
    </ul>
  )
}