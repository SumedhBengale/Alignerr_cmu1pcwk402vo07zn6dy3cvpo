import { RefreshCw, TriangleAlert } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  retry?: () => void
  compact?: boolean
}

export function ErrorState({
  title = 'We couldn’t load this data',
  message = 'The request failed, timed out, or the service is unavailable.',
  retry,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 text-center ${
        compact ? 'p-6' : 'p-10'
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
        <TriangleAlert className="h-5 w-5 text-rose-500" />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      </div>
      {retry && (
        <button
          type="button"
          onClick={retry}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  )
}