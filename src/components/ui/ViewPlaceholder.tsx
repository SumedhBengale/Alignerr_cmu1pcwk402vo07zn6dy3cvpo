import type { LucideIcon } from 'lucide-react'

interface ViewPlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
}

export function ViewPlaceholder({ title, description, icon: Icon }: ViewPlaceholderProps) {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-500" />
      </div>
      <h2 className="mt-3 text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  )
}