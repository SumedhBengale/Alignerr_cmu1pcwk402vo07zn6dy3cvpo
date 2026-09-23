import type { LucideIcon } from 'lucide-react'

interface ItemTagProps {
  icon: LucideIcon
  label: string
  className?: string
}

/**
 * Small inline tag/chip used for metadata attached to a list item
 * (e.g. the branch name next to a service in the deployments table).
 */
export function ItemTag({ icon: Icon, label, className = '' }: ItemTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 ${className}`}
    >
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      {label}
    </span>
  )
}