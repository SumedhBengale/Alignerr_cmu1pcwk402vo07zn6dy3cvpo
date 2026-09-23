export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg">
        <svg
          className="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 14h4l3-8 4 12 3-6h4" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">PulseMetrics</h1>
      <p className="text-sm text-slate-500">Engineering analytics &amp; deployment management</p>
    </main>
  )
}