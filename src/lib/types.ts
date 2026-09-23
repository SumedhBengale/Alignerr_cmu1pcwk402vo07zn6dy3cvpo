export type Environment = 'production' | 'staging' | 'preview'

export type DeploymentStatus = 'success' | 'building' | 'failed'

export type ServiceStatus = 'healthy' | 'degraded' | 'down'

export type DeploymentTrigger = 'push' | 'schedule' | 'manual'

export interface ServiceBranch {
  name: string
}

export interface Service {
  id: string
  name: string
  description: string
  owner: string
  defaultBranch: string
  branches: string[]
  status: ServiceStatus
  version: string
  uptimePct30d: number
}

export interface Deployment {
  id: string
  commit: string
  commitMessage: string
  serviceId: string
  serviceName: string
  triggeredBy: string
  trigger: DeploymentTrigger
  environment: Environment
  status: DeploymentStatus
  durationSec: number
  minutesAgo: number
}

export type ActivityKind = 'deploy' | 'incident' | 'rollback' | 'config'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  user: string
  minutesAgo: number
  tone: 'success' | 'danger' | 'warning' | 'neutral'
}

export interface MetricCard {
  id: 'successRate' | 'activeServices' | 'errorBudget' | 'deploymentFrequency'
  label: string
  value: string
  rawValue: number
  changePct: number
  positive: boolean
  hint: string
  samples: number[]
}

export interface MetricsSummary {
  cards: MetricCard[]
  updatedAt: number
}

export interface ProjectHealthItem {
  serviceId: string
  name: string
  description: string
  status: ServiceStatus
  version: string
  uptimePct30d: number
  owner: string
}

export interface Incident {
  id: string
  code: string
  title: string
  severity: 'SEV1' | 'SEV2' | 'SEV3'
  status: 'investigating' | 'monitoring' | 'resolved'
  openedBy: string
  minutesAgo: number
}

export interface SystemSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

export interface DeploymentFilters {
  q?: string | null
  status?: DeploymentStatus | null
  environment?: Environment | null
  service?: string | null
  /** ISO timestamp (inclusive lower bound on `minutesAgo` recency). */
  updatedAfter?: string | null
  updatedBefore?: string | null
}