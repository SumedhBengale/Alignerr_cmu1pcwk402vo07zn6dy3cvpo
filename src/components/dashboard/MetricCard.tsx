import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { MetricCard as MetricCardType } from '../../lib/types'
import { Sparkline } from './Sparkline'

interface MetricCardProps {
  metric: MetricCardType
}

export function MetricCardView({ metric }: MetricCardProps) {
  const TrendIcon = metric.positive ? ArrowUpRight : ArrowDownRight
  const accent = metric.positive ? 'text-emerald-600' : 'text-rose-600'
  const pill = metric.positive
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-rose-50 text-rose-700'

  return (
    <div className="relative group rounded-xl border border-slate-200 bg-white p-4 shadow-card transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 pr-16">
          <p className="truncate text-[13px] font-medium text-slate-500">{metric.label}</p>
          <p className="mt-1.5 text-[28px] font-semibold leading-none tracking-tight text-slate-900">
            {metric.value}
          </p>
        </div>
        <span className={`absolute right-3 top-3 inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold ${pill}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {metric.changePct > 0 ? '+' : ''}
          {metric.changePct.toFixed(1)}%
        </span>
      </div>
      <div className="relative mt-2 h-10">
        <Sparkline samples={metric.samples} positive={metric.positive} />
      </div>
      <p className={`mt-2 flex items-center gap-1 text-xs text-slate-400`}>
        <span className={`font-medium ${accent}`}>
          {metric.positive ? '▲' : '▼'} {Math.abs(metric.changePct).toFixed(1)}%
        </span>
        <span>· {metric.hint}</span>
      </p>
    </div>
  )
}