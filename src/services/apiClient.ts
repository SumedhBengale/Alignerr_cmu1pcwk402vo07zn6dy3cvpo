import type {
  ActivityItem,
  DeploymentFilters,
  Incident,
  MetricsSummary,
  ProjectHealthItem,
  Service,
  SystemSetting,
} from '../lib/types'
import type { FilteredDeploymentsResponse } from './mockServer'
import { routeRequest } from './mockServer'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function toQueryString(params: Record<string, string | number | null | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && String(value) !== '') {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

async function getJson<T>(path: string, params?: Record<string, string | number | null | undefined>): Promise<T> {
  const response = await routeRequest<T>(`${path}${params ? toQueryString(params) : ''}`)
  if (!response.ok || response.data === null) {
    throw new ApiError(response.status, response.error ?? `Request to ${path} failed (${response.status}).`)
  }
  return response.data
}

export const api = {
  /** GET /api/deployments — filterable, paginated deployment feed. */
  getDeployments: (
    filters: DeploymentFilters = {},
  ): Promise<FilteredDeploymentsResponse> =>
    getJson<FilteredDeploymentsResponse>('/api/deployments', {
      q: filters.q,
      status: filters.status,
      environment: filters.environment,
      service: filters.service,
      updatedAfter: filters.updatedAfter,
      updatedBefore: filters.updatedBefore,
    }),

  /** GET /api/services — full service catalog for selects and lookups. */
  getServices: (): Promise<{ items: Service[] }> =>
    getJson<{ items: Service[] }>('/api/services'),

  /** GET /api/projects/health — service health for the given team. */
  getProjectHealth: (teamId: string): Promise<{ items: ProjectHealthItem[]; team: string }> =>
    getJson<{ items: ProjectHealthItem[]; team: string }>('/api/projects/health', { team: teamId }),

  /** GET /api/metrics — key metric cards with 30-day samples. */
  getMetrics: (teamId: string): Promise<MetricsSummary> =>
    getJson<MetricsSummary>('/api/metrics', { team: teamId }),

  /** GET /api/activity — cursor-paginated team activity feed. */
  getActivity: (teamId: string, cursor = 0, limit = 20): Promise<{
    items: ActivityItem[]
    team: string
    nextCursor: number | null
  }> =>
    getJson<{ items: ActivityItem[]; team: string; nextCursor: number | null }>('/api/activity', {
      team: teamId,
      cursor,
      limit,
    }),

  /** GET /api/incidents — incident history for the team. */
  getIncidents: (): Promise<{ items: Incident[] }> =>
    getJson<{ items: Incident[] }>('/api/incidents'),

  /** GET /api/settings — workspace-level system settings. */
  getSystemSettings: (): Promise<{ items: SystemSetting[] }> =>
    getJson<{ items: SystemSetting[] }>('/api/settings'),
}