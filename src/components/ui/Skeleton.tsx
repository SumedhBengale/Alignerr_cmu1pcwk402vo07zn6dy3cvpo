import type { ReactNode } from 'react'

interface SkeletonBlockProps {
  className?: string
}

/** A single shimmering placeholder block; size it with width/height utilities. */
export function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return (
    <span className={`block animate-pulse rounded-md bg-slate-200/80 ${className}`} aria-hidden="true" />
  )
}

interface SkeletonRowsProps {
  rows?: number
}

/** Stacked row placeholders used inside lists and cards while data loads. */
export function SkeletonRows({ rows = 4 }: SkeletonRowsProps) {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBlock className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBlock className="h-3 w-2/3" />
            <SkeletonBlock className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface CardGridSkeletonProps {
  cards?: number
  children?: ReactNode
}

/** Placeholder grid mirroring the metric-card layout. */
export function CardGridSkeleton({ cards = 4 }: CardGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: cards }, (_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-3 h-7 w-20" />
          <SkeletonBlock className="mt-2 h-3 w-32" />
        </div>
      ))}
    </div>
  )
}

interface PanelSkeletonProps {
  rows?: number
}

export function PanelSkeleton({ rows = 5 }: PanelSkeletonProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <SkeletonBlock className="h-4 w-40" />
      <div className="mt-4">
        <SkeletonRows rows={rows} />
      </div>
    </div>
  )
}