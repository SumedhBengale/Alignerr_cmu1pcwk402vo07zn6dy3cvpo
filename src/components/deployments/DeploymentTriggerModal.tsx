import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CheckCircle2,
  ChevronRight,
  GitBranch,
  LoaderCircle,
  Plus,
  Server,
  Trash2,
  X,
} from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { api } from '../../services/apiClient'
import type { Environment, Service } from '../../lib/types'

interface EnvVar {
  id: number
  key: string
  value: string
}

interface DeploymentTriggerModalProps {
  open: boolean
  onClose: () => void
}

type Step = 1 | 2
type Phase = 'form' | 'submitting' | 'success'

interface FieldErrors {
  serviceId?: string
  branch?: string
  environment?: string
  commitRef?: string
  buildArgs?: string
  envVars?: string
}

let envVarCounter = 0
const newEnvVar = (): EnvVar => ({ id: ++envVarCounter, key: '', value: '' })

const ENVIRONMENT_OPTIONS: { value: Environment; label: string }[] = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'preview', label: 'Preview' },
]

export function DeploymentTriggerModal({ open, onClose }: DeploymentTriggerModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [phase, setPhase] = useState<Phase>('form')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serviceId, setServiceId] = useState('')
  const [branch, setBranch] = useState('')
  const [environment, setEnvironment] = useState<Environment>('production')
  const [commitRef, setCommitRef] = useState('')
  const [buildArgs, setBuildArgs] = useState('--ci --no-cache')
  const [envVars, setEnvVars] = useState<EnvVar[]>([newEnvVar()])
  const [queuedCommit, setQueuedCommit] = useState('')
  const [submittedService, setSubmittedService] = useState<Service | null>(null)

  const services = useAsync<Service[]>(() => api.getServices().then((r) => r.items), 'services', {
    enabled: open,
  })

  const selectedService = useMemo(
    () => services.data?.find((s) => s.id === serviceId) ?? null,
    [services.data, serviceId],
  )

  // Fallback defaults: once a service is picked, prefill the branch with the
  // service default and the commit ref with the chosen branch name.
  const handleServiceChange = (id: string) => {
    setServiceId(id)
    const svc = services.data?.find((s) => s.id === id)
    if (svc) {
      setBranch((current) => (svc.branches.includes(current) ? current : svc.defaultBranch))
      setCommitRef((current) => (current ? current : svc.defaultBranch))
    }
    setErrors((e) => ({ ...e, serviceId: undefined }))
  }

  const handleBranchChange = (name: string) => {
    setBranch(name)
    setCommitRef((current) => (current ? current : name))
    setErrors((e) => ({ ...e, branch: undefined }))
  }

  // Escape key closes the modal (never mid-submit).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'submitting') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, phase, onClose])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  // Reset the form each time the modal is (re)opened.
  useEffect(() => {
    if (!open) return
    setStep(1)
    setPhase('form')
    setErrors({})
    setServiceId('')
    setBranch('')
    setEnvironment('production')
    setCommitRef('')
    setBuildArgs('--ci --no-cache')
    setEnvVars([newEnvVar()])
    setQueuedCommit('')
    setSubmittedService(null)
  }, [open])

  if (!open) return null

  const validateStep1 = (): boolean => {
    const next: FieldErrors = {}
    if (!serviceId) next.serviceId = 'Choose a service to deploy.'
    if (!branch) next.branch = 'Choose a branch.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validateStep2 = (): boolean => {
    const next: FieldErrors = {}
    if (!commitRef.trim()) next.commitRef = 'Enter a commit ref (e.g. main or a SHA).'
    if (!buildArgs.trim()) next.buildArgs = 'Build arguments are required; fallback is “--ci --no-cache”.'
    const keys = envVars
      .filter((v) => v.key.trim() !== '' || v.value.trim() !== '')
      .map((v) => v.key.trim())
    if (keys.some((k) => k === '')) {
      next.envVars = 'Environment variable keys cannot be empty when a value is set.'
    } else if (new Set(keys).size !== keys.length) {
      next.envVars = 'Duplicate variable keys are not allowed.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goToStep2 = () => {
    if (validateStep1()) {
      setStep(2)
      setErrors({})
    }
  }

  const handleSubmit = () => {
    if (!validateStep2()) return
    setPhase('submitting')
    // Simulate the API round-trip that queues the deployment.
    setTimeout(() => {
      setQueuedCommit(Math.random().toString(16).slice(2, 9))
      setSubmittedService(selectedService)
      setPhase('success')
      window.setTimeout(onClose, 1600)
    }, 950)
  }

  const inputClass = (invalid: boolean) =>
    `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
      invalid
        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
        : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
    }`

  const stepIndicator = (n: Step, label: string) => {
    const active = step === n
    const done = n === 1 && step === 2
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`flex h-6 min-w-[70px] items-center justify-center rounded-md px-1.5 text-xs font-semibold tracking-tight ${
            active
              ? 'bg-indigo-600 text-white'
              : done
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-400'
          }`}
        >
          {done ? 'Step 1 ✓' : `Step ${n}`}
        </span>
        <span className={`truncate text-sm font-medium ${active ? 'text-slate-900' : 'text-slate-400'}`}>
          {label}
        </span>
      </div>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={() => phase !== 'submitting' && onClose()}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Trigger new deployment"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg animate-fade-in flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
            {stepIndicator(1, 'Service & branch')}
            <ChevronRight className="h-4 w-4 text-slate-300" />
            {stepIndicator(2, 'Build parameters')}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={phase === 'submitting'}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </header>

        {phase === 'success' ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900">Deployment queued</p>
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-mono text-indigo-600">{queuedCommit}</span>{' '}
                {submittedService && (
                  <>
                    on {submittedService.name} ({branch} → {environment})
                  </>
                )}
              </p>
            </div>
            <p className="text-xs text-slate-400">You can follow progress on the Deployments page.</p>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="dep-service" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Service
                    </label>
                    <select
                      id="dep-service"
                      value={serviceId}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className={inputClass(Boolean(errors.serviceId))}
                    >
                      <option value="">Select a service…</option>
                      {services.data?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId ? (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.serviceId}</p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-400">
                        {services.error
                          ? 'Service catalog unavailable — check your connection.'
                          : services.loading
                            ? 'Loading service catalog…'
                            : `${services.data?.length ?? 0} services available`}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dep-branch" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Branch
                    </label>
                    <div className="relative">
                      <GitBranch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        id="dep-branch"
                        value={branch}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        disabled={!selectedService}
                        className={`${inputClass(Boolean(errors.branch))} pl-9 disabled:cursor-not-allowed disabled:bg-slate-50`}
                      >
                        <option value="">
                          {selectedService ? 'Select a branch…' : 'Pick a service first'}
                        </option>
                        {selectedService?.branches.map((b) => (
                          <option key={b} value={b}>
                            {b}
                            {b === selectedService.defaultBranch ? ' (default)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.branch ? (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.branch}</p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-400">
                        Builds run against the latest commit on the selected branch.
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      Target environment
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {ENVIRONMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setEnvironment(opt.value)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            environment === opt.value
                              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                    Deploying <span className="font-medium text-slate-700">{selectedService?.name}</span>{' '}
                    from <span className="font-mono text-indigo-600">{branch}</span> to{' '}
                    <span className="font-medium uppercase tracking-wide text-slate-700">
                      {environment}
                    </span>
                  </div>

                  <div>
                    <label htmlFor="dep-commit" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Commit ref
                    </label>
                    <input
                      id="dep-commit"
                      type="text"
                      value={commitRef}
                      onChange={(e) => {
                        setCommitRef(e.target.value)
                        setErrors((prev) => ({ ...prev, commitRef: undefined }))
                      }}
                      placeholder={selectedService?.defaultBranch ?? 'main'}
                      className={`${inputClass(Boolean(errors.commitRef))} font-mono`}
                    />
                    {errors.commitRef ? (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.commitRef}</p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-400">
                        Defaults to the selected branch; enter a SHA to pin the commit.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dep-buildargs" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Build arguments
                    </label>
                    <input
                      id="dep-buildargs"
                      type="text"
                      value={buildArgs}
                      onChange={(e) => {
                        setBuildArgs(e.target.value)
                        setErrors((prev) => ({ ...prev, buildArgs: undefined }))
                      }}
                      placeholder="--ci --no-cache"
                      className={`${inputClass(Boolean(errors.buildArgs))} font-mono`}
                    />
                    {errors.buildArgs ? (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.buildArgs}</p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-400">
                        Passed to the build runner; fallback default is “--ci --no-cache”.
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Environment variables
                        <span className="ml-1 font-normal text-slate-400">(optional)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setEnvVars((v) => [...v, newEnvVar()])}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add variable
                      </button>
                    </div>
                    <div className="space-y-2">
                      {envVars.map((envVar) => (
                        <div key={envVar.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={envVar.key}
                            onChange={(e) =>
                              setEnvVars((vars) =>
                                vars.map((v) => (v.id === envVar.id ? { ...v, key: e.target.value } : v)),
                              )
                            }
                            placeholder="KEY (e.g. NODE_ENV)"
                            className={`${inputClass(Boolean(errors.envVars))} w-[45%] font-mono text-xs uppercase`}
                          />
                          <span className="text-slate-300">=</span>
                          <input
                            type="text"
                            value={envVar.value}
                            onChange={(e) =>
                              setEnvVars((vars) =>
                                vars.map((v) => (v.id === envVar.id ? { ...v, value: e.target.value } : v)),
                              )
                            }
                            placeholder="value"
                            className={`${inputClass(Boolean(errors.envVars))} font-mono text-xs`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEnvVars((vars) =>
                                vars.length > 1 ? vars.filter((v) => v.id !== envVar.id) : vars,
                              )
                            }
                            disabled={envVars.length === 1}
                            aria-label="Remove variable"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.envVars && (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.envVars}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
              <div className="flex items-center gap-2 text-sm">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={phase === 'submitting'}
                    className="rounded-lg px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={phase === 'submitting'}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  Cancel
                </button>
              </div>
              {step === 1 ? (
                <button
                  type="button"
                  onClick={goToStep2}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                >
                  <Server className="h-4 w-4" />
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={phase === 'submitting'}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"
                >
                  {phase === 'submitting' ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Queueing…
                    </>
                  ) : (
                    <>
                      <Server className="h-4 w-4" />
                      Trigger deployment
                    </>
                  )}
                </button>
              )}
            </footer>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}