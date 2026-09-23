import { useEffect, useState } from 'react'
import { Plus, Rocket, Search } from 'lucide-react'
import { DeploymentsTable } from '../components/deployments/DeploymentsTable'
import { DeploymentTriggerModal } from '../components/deployments/DeploymentTriggerModal'
import { ErrorState } from '../components/ui/ErrorState'
import { api } from '../services/apiClient'
import { useAsync } from '../hooks/useAsync'
import type { DeploymentStatus, Environment } from '../lib/types'

type StatusFilter = DeploymentStatus | 'all'
type EnvironmentFilter = Environment | 'all'

export function DeploymentsView() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [environment, setEnvironment] = useState<EnvironmentFilter>('all')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [triggerOpen, setTriggerOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 220)
    return () => clearTimeout(timer)
  }, [search])

  const requestKey = `${debouncedSearch}|${status}|${environment}`

  const { data, loading, error, reload } = useAsync(
    () =>
      api.getDeployments({
        q: debouncedSearch || null,
        status: status === 'all' ? null : status,
        environment: environment === 'all' ? null : environment,
      }),
    requestKey,
  )

  const total = data?.total ?? 0
  const filtered = debouncedSearch !== '' || status !== 'all' || environment !== 'all'
  const items = data?.items ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recent deployments</h2>
          <p className="text-sm text-slate-500">
            {loading
              ? 'Loading the deployment feed…'
              : `${items.length} of ${total} deployments · all teams`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTriggerOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Trigger new deployment
          </button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commit, service…"
              aria-label="Search deployments"
              className="h-9 w-52 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-700 shadow-sm transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            aria-label="Filter by status"
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="building">Building</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as EnvironmentFilter)}
            aria-label="Filter by environment"
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All environments</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="preview">Preview</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Rocket className="h-4 w-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Deployment history</p>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatus('all')
                setEnvironment('all')
              }}
              className="ml-auto text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {error ? (
          <ErrorState message={error} retry={reload} />
        ) : (
          <DeploymentsTable items={items} loading={loading} filtered={filtered} />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500">
            Showing {items.length} of {total} deployment records · sorted newest first
          </div>
        )}
      </div>

      <DeploymentTriggerModal open={triggerOpen} onClose={() => setTriggerOpen(false)} />
    </div>
  )
}