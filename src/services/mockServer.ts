/**
 * In-browser stand-in for the PulseMetrics REST API.
 *
 * Every request goes through `routeRequest()`, which simulates network
 * latency, supports a configurable number of consecutive failures per path,
 * and enforces the same query-parameter contracts the real server would.
 */
import {
  ACTIVITY,
  DEPLOYMENTS,
  INCIDENTS,
  METRICS_BY_TEAM,
  SERVICES,
  SYSTEM_SETTINGS,
} from '../lib/mockData'
import type {
  ActivityItem,
  Deployment,
  DeploymentFilters,
  DeploymentStatus,
  Environment,
  Incident,
  ProjectHealthItem,
  SystemSetting,
} from '../lib/types'

const VALID_DEPLOYMENT_STATUSES: DeploymentStatus[] = ['success', 'building', 'failed']
const VALID_ENVIRONMENTS: Environment[] = ['production', 'staging', 'preview']
const KNOWN_TEAMS = new Set(['core', 'web', 'data'])

export class MockRouteError extends Error {
  readonly status: number
  readonly path: string

  constructor(path: string, status: number, message: string) {
    super(message)
    this.name = 'MockRouteError'
    this.path = path
    this.status = status
  }
}

interface RouteContext {
  path: string
  searchParams: URLSearchParams
}

export interface FilteredDeploymentsResponse {
  items: Deployment[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

const randomLatency = () => {
  const base = 160 + Math.random() * 220
  const jitter = Math.random() * 400
  return Math.round(base + Math.min(jitter, Math.max(550 - base, 0)))
}
let latencyCap: number | null = null

/** Cap simulated latency for the rest of this session (used for UI testing). */
export function setMockLatencyCap(ms: number) {
  latencyCap = ms
}

export function clearMockLatencyCap() {
  latencyCap = null
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const failureCounts = new Map<string, { remaining: number; status: number }>()

/**
 * Makes the next `count` requests to `path` fail with `status`, so the
 * loading → error fallback can be demonstrated without a real outage.
 * Pass `count = 0` to clear any pending failures.
 */
export function injectFailures(path: string, count: number, status = 503): void {
  const key = path.replace(/\/+$/, '')
  if (count <= 0) {
    failureCounts.delete(key)
    return
  }
  failureCounts.set(key, { remaining: count, status })
}

function maybeInjectFailure(path: string): void {
  const key = path.replace(/\/+$/, '')
  const entry = failureCounts.get(key)
  if (!entry || entry.remaining <= 0) return
  entry.remaining -= 1
  if (entry.remaining <= 0) failureCounts.delete(key)
  throw new MockRouteError(path, entry.status, 'Service unavailable — try again in a moment.')
}

interface RouteResult {
  status: number
  body: unknown
}

function handleListDeployments({ path, searchParams }: RouteContext): RouteResult {
  const q = searchParams.get('q')
  const statusParam = searchParams.get('status')
  const environmentParam = searchParams.get('environment')
  const serviceParam = searchParams.get('service')
  const updatedAfter = searchParams.get('updatedAfter')
  const updatedBefore = searchParams.get('updatedBefore')
  const filters: DeploymentFilters = {
    q,
    status: (statusParam as DeploymentStatus | null) ?? null,
    environment: (environmentParam as Environment | null) ?? null,
    service: serviceParam,
    updatedAfter,
    updatedBefore,
  }

  if (filters.status && !VALID_DEPLOYMENT_STATUSES.includes(filters.status as DeploymentStatus)) {
    throw new MockRouteError(
      path,
      400,
      `Invalid status “${String(filters.status)}”. Expected one of: ${VALID_DEPLOYMENT_STATUSES.join(', ')}.`,
    )
  }
  if (
    filters.environment &&
    !VALID_ENVIRONMENTS.includes(filters.environment as Environment)
  ) {
    throw new MockRouteError(
      path,
      400,
      `Invalid environment “${String(filters.environment)}”. Expected one of: ${VALID_ENVIRONMENTS.join(', ')}.`,
    )
  }

  const query = filters.q?.trim().toLowerCase() ?? ''
  let items = DEPLOYMENTS.filter((d) => {
    if (filters.status && d.status !== filters.status) return false
    if (filters.environment && d.environment !== filters.environment) return false
    if (filters.service && d.serviceName !== filters.service) return false
    if (query) {
      const haystack = `${d.serviceName} ${d.commit} ${d.triggeredBy} ${d.commitMessage}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  items = [...items].sort((a, b) => a.minutesAgo - b.minutesAgo)

  const pageSize = 100
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const start = (page - 1) * pageSize
  return {
    status: 200,
    body: {
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      pageSize,
      hasMore: start + pageSize < items.length,
    } satisfies FilteredDeploymentsResponse,
  }
}

function requireTeam(searchParams: URLSearchParams, path: string): string {
  const team = searchParams.get('team') ?? 'core'
  if (!KNOWN_TEAMS.has(team)) {
    throw new MockRouteError(
      path,
      400,
      `Unknown team “${team}”. Expected one of: ${[...KNOWN_TEAMS].join(', ')}.`,
    )
  }
  return team
}

function handleListServices({ path }: RouteContext): RouteResult {
  maybeInjectFailure(path)
  return { status: 200, body: { items: SERVICES } }
}

function handleProjectHealth({ path, searchParams }: RouteContext): RouteResult {
  const team = requireTeam(searchParams, path)
  const items: ProjectHealthItem[] = SERVICES.map((s) => ({
    serviceId: s.id,
    name: s.name,
    description: s.description,
    status: s.status,
    version: s.version,
    uptimePct30d: s.uptimePct30d + (team === 'web' ? -0.35 : team === 'data' ? 0.03 : 0),
    owner: s.owner,
  }))
  return { status: 200, body: { items, team } }
}

function handleMetrics({ path, searchParams }: RouteContext): RouteResult {
  const team = requireTeam(searchParams, path)
  const summary = METRICS_BY_TEAM[team]
  return { status: 200, body: summary }
}

function handleActivity({ path, searchParams }: RouteContext): RouteResult {
  const team = requireTeam(searchParams, path)
  const start = (Number(searchParams.get('cursor') ?? '0') as number)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '20') as number))
  const items: ActivityItem[] = ACTIVITY.slice(start, start + limit)
  return { status: 200, body: { items, team, nextCursor: start + limit >= ACTIVITY.length ? null : start + limit } }
}

function handleIncidents(): RouteResult {
  return { status: 200, body: { items: INCIDENTS } satisfies { items: Incident[] } }
}

function handleSettings(): RouteResult {
  return { status: 200, body: { items: SYSTEM_SETTINGS } satisfies { items: SystemSetting[] } }
}

function resolveRoute(ctx: RouteContext): RouteResult {
  switch (ctx.path) {
    case '/api/deployments':
      return handleListDeployments(ctx)
    case '/api/services':
      return handleListServices(ctx)
    case '/api/projects/health':
      return handleProjectHealth(ctx)
    case '/api/metrics':
      return handleMetrics(ctx)
    case '/api/activity':
      return handleActivity(ctx)
    case '/api/incidents':
      return handleIncidents()
    case '/api/settings':
      return handleSettings()
    default:
      throw new MockRouteError(ctx.path, 404, `No mock route for ${ctx.path}.`)
  }
}

export interface MockResponse<T> {
  ok: boolean
  status: number
  data: T | null
  error: string | null
}

/**
 * Routes a GET request against the in-memory API. Mirrors `fetch(url)`
 * semantics: `fullUrl` is a same-origin URL (e.g. `/api/deployments?status=all`).
 */
export async function routeRequest<T>(fullUrl: string): Promise<MockResponse<T>> {
  let url: URL
  try {
    url = new URL(fullUrl, window.location.origin)
  } catch {
    return { ok: false, status: 400, data: null, error: `Invalid request URL: ${fullUrl}` }
  }

  const path = url.pathname
  const ctx: RouteContext = { path, searchParams: url.searchParams }

  await wait(latencyCap ?? randomLatency())

  try {
    const result = resolveRoute(ctx)
    return { ok: true, status: result.status, data: result.body as T, error: null }
  } catch (cause) {
    if (cause instanceof MockRouteError) {
      return { ok: false, status: cause.status, data: null, error: cause.message }
    }
    throw cause
  }
}