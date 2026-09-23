interface LogoMarkProps {
  className?: string
}

export function LogoMark({ className = 'h-8 w-8' }: LogoMarkProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[58%] w-[58%] text-white"
      >
        <path d="M3 13h4l3-7 4 13 3-6h4" />
      </svg>
    </span>
  )
}