import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react'
import type { DeploymentStatus, Environment, ServiceStatus } from '../../lib/types'

const DEPLOYMENT_STATUS_STYLES: Record<DeploymentStatus, { label: string; classes: string }> = {
  success: {
    label: 'Success',
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  },
  building: {
    label: 'Building',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  },
  failed: {
    label: 'Failed',
    classes: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
  },
}

export function DeploymentStatusBadge({ status }: { status: DeploymentStatus }) {
  const { label, classes } = DEPLOYMENT_STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {status === 'success' && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
      {status === 'building' && <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin" />}
      {status === 'failed' && <XCircle className="h-3.5 w-3.5 shrink-0" />}
      {label}
    </span>
  )
}

const ENVIRONMENT_STYLES: Record<Environment, string> = {
  production: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20',
  staging: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',
  preview: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20',
}

const ENVIRONMENT_LABELS: Record<Environment, string> = {
  production: 'Production',
  staging: 'Staging',
  preview: 'Preview',
}

export function EnvironmentBadge({ environment }: { environment: Environment }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${
        ENVIRONMENT_STYLES[environment]
      }`}
    >
      {ENVIRONMENT_LABELS[environment]}
    </span>
  )
}

const SERVICE_STATUS_DOTS: Record<ServiceStatus, { dot: string; label: string; text: string }> = {
  healthy: { dot: 'bg-emerald-500', label: 'Healthy', text: 'text-emerald-700' },
  degraded: { dot: 'bg-amber-500', label: 'Degraded', text: 'text-amber-700' },
  down: { dot: 'bg-rose-500', label: 'Down', text: 'text-rose-700' },
}

export function ServiceStatusIndicator({ status }: { status: ServiceStatus }) {
  const { dot, label, text } = SERVICE_STATUS_DOTS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${text}`}>
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            status === 'down' ? 'animate-pulse bg-rose-400' : status === 'degraded' ? 'animate-pulse bg-amber-400' : ''
          } opacity-60 ${dot}`}
        />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      {label}
    </span>
  )
}