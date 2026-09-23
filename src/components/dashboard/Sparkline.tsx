import { useId } from 'react'

interface SparklineProps {
  samples: number[]
  positive: boolean
  width?: number
  height?: number
}

export function Sparkline({ samples, positive, width = 120, height = 40 }: SparklineProps) {
  const gradientId = useId()
  if (samples.length < 2) return null

  const min = Math.min(...samples)
  const max = Math.max(...samples)
  const span = max - min || 1

  const points = samples.map((value, i) => {
    const x = (i / (samples.length - 1)) * (width - 4) + 2
    const y = height - 4 - ((value - min) / span) * (height - 8)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const line = points.join(' ')
  const area = `2,${height - 2} ${line} ${width - 2},${height - 2}`
  const stroke = positive ? '#10b981' : '#f43f5e'
  const stopColor = positive ? 'rgba(16,185,129,0.18)' : 'rgba(244,63,94,0.16)'

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-10 w-full"
      role="img"
      aria-label="30-day trend"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stopColor} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}