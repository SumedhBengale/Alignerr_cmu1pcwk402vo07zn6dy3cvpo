import { Activity, Server } from 'lucide-react'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { MetricCardView } from '../components/dashboard/MetricCard'
import { ProjectHealthList } from '../components/dashboard/ProjectHealthList'
import { CardGridSkeleton, PanelSkeleton } from '../components/ui/Skeleton'
import { ErrorState } from '../components/ui/ErrorState'
import { useAsync } from '../hooks/useAsync'
import type { Team } from '../lib/navigation'
import type { ActivityItem, ProjectHealthItem } from '../lib/types'
import { api } from '../services/apiClient'

interface DashboardViewProps {
  team: Team
}

export function DashboardView({ team }: DashboardViewProps) {
  const metrics = useAsync(() => api.getMetrics(team.id), `metrics:${team.id}`)
  const health = useAsync(() => api.getProjectHealth(team.id), `health:${team.id}`)
  const feed = useAsync(() => api.getActivity(team.id), `activity:${team.id}`)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {team.name} overview
        </h2>
        <p className="text-sm text-slate-500">
          Reliability and delivery signal across the team&rsquo;s services, last 30 days.
        </p>
      </div>

      <section aria-label="Key metrics" className="space-y-3">
        {metrics.loading && <CardGridSkeleton cards={4} />}
        {metrics.error && (
          <div className="rounded-xl border border-slate-200 bg-white">
            <ErrorState message={metrics.error} retry={metrics.reload} compact />
          </div>
        )}
        {metrics.data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.data.cards.map((metric) => (
              <MetricCardView key={metric.id} metric={metric} />
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3" aria-label="Activity and service health">
        <div className="rounded-xl border border-slate-200 bg-white shadow-card lg:col-span-1">
          <header className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <Activity className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">Recent activity</h3>
          </header>
          <div className="p-4">
            {feed.loading ? (
              <PanelSkeleton rows={5} />
            ) : feed.error ? (
              <ErrorState message={feed.error} retry={feed.reload} compact />
            ) : feed.data ? (
              <ActivityFeed items={feed.data.items as ActivityItem[]} />
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-card lg:col-span-2">
          <header className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <Server className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">Project health</h3>
            <span className="ml-auto text-xs text-slate-400">
              {health.data ? `${health.data.items.length} services` : '…'}
            </span>
          </header>
          <div className="p-4">
            {health.loading ? (
              <PanelSkeleton rows={6} />
            ) : health.error ? (
              <ErrorState message={health.error} retry={health.reload} compact />
            ) : health.data ? (
              <ProjectHealthList items={health.data.items as ProjectHealthItem[]} />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}