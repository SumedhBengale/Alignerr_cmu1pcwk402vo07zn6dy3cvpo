import { useCallback, useEffect, useRef, useState } from 'react'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface Options {
  /** Re-fire when this value (re)appears after being absent (e.g. a modal opening). */
  enabled?: boolean
}

function toErrorMessage(cause: unknown): string {
  if (cause instanceof Error && cause.name === 'ApiError') return cause.message
  if (cause instanceof TypeError) return 'Network error — check your connection and retry.'
  if (cause instanceof Error) return cause.message
  return 'Something went wrong while loading this data.'
}

/**
 * Minimal data-fetching hook around a promise-returning `request` function.
 *
 * `key` must be a stable, serializable value (a string is ideal) that fully
 * describes the request: the effect re-runs whenever `key` changes. The
 * `request` closure itself is deliberately NOT an effect dependency, so
 * callers may pass inline arrow functions without triggering refetch loops.
 */
export function useAsync<T>(
  request: () => Promise<T>,
  key: string,
  options: Options = {},
): AsyncState<T> & { reload: () => void } {
  const { enabled = true } = options
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: enabled,
    error: null,
  })
  const requestRef = useRef(request)
  requestRef.current = request
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!enabled) return

    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))

    void (async () => {
      try {
        const data = await requestRef.current()
        if (active) {
          setState({ data, loading: false, error: null })
        }
      } catch (cause) {
        if (active) {
          setState((s) => ({ ...s, loading: false, error: toErrorMessage(cause) }))
        }
      }
    })()

    return () => {
      active = false
    }
    // Note: the `request` closure is held in a ref on purpose — it is not an
    // effect dependency, so inline arrow functions never cause refetch loops.
    // `key` must be stable for the lifetime of the fetch identity.
  }, [key, nonce, enabled])

  const reload = useCallback(() => {
    setNonce((n) => n + 1)
  }, [])

  return { ...state, reload }
}