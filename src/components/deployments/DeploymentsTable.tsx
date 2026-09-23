import { GitBranch, SearchX } from 'lucide-react'
import { formatRelativeTime, initialsOf } from '../../lib/format'
import type { Deployment } from '../../lib/types'
import { EmptyState } from '../ui/EmptyState'
import { ItemTag } from '../ui/ItemTag'
import { DeploymentStatusBadge, EnvironmentBadge } from '../ui/StatusBadges'
import { ActionMenu } from './ActionMenu'

interface DeploymentsTableProps {
  items: Deployment[]
  loading: boolean
  filtered: boolean
}

const HEADERS = ['Commit', 'Service', 'Triggered by', 'Status', 'Environment', 'Started', '']

export function DeploymentsTable({ items, loading, filtered }: DeploymentsTableProps) {
  return (
    <div className="relative overflow-x-auto" style={{ overflowY: 'hidden' }}>
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            {HEADERS.map((header, index) => (
              <th
                key={index}
                scope="col"
                className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${
                  index === HEADERS.length - 1 ? 'w-14 text-right' : ''
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 6 }, (_, i) => (
              <tr key={`skeleton-${i}`} className="border-b border-slate-100 last:border-b-0">
                {HEADERS.map((_, col) => (
                  <td key={col} className="px-4 py-3.5">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading &&
            items.map((d) => (
              <tr
                key={d.id}
                className="relative border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60 z-0"
              >
                <td className="px-4 py-3.5">
                  <p className="font-mono text-xs font-medium text-indigo-600">{d.commit}</p>
                  <p className="mt-0.5 whitespace-nowrap text-xs text-slate-500">{d.commitMessage}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-slate-800">{d.serviceName}</p>
                  <p className="text-xs text-slate-400">#{d.id.replace('dep-', '')}</p>
                </td>
                <td className="max-w-[230px] px-4 py-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                      {initialsOf(d.triggeredBy)}
                    </span>
                    <div className="relative">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-slate-800">{d.triggeredBy}</p>
                        <div className="relative -ml-6 -top-1">
                          <ItemTag icon={GitBranch} label={d.branch} />
                        </div>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        #{d.id.replace('dep-', '')} · {d.trigger === 'push' ? 'CI run' : d.trigger === 'schedule' ? 'scheduled' : 'manual'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <DeploymentStatusBadge status={d.status} />
                </td>
                <td className="px-4 py-3.5">
                  <EnvironmentBadge environment={d.environment} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">
                  {formatRelativeTime(d.minutesAgo)}
                </td>
                <td className="px-4 py-3.5">
                  <ActionMenu deployment={d} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {!loading && items.length === 0 && filtered && (
        <tbody>
          <tr>
            <td colSpan={HEADERS.length}>
              <EmptyState
                icon={SearchX}
                title="No deployments match your filters"
                description="Try clearing the search or widening the status and environment filters."
              />
            </td>
          </tr>
        </tbody>
      )}
    </div>
  )
}