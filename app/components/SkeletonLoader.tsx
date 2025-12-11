interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'summary'
  count?: number
  className?: string
}

export function SkeletonLoader({ variant = 'text', count = 1, className = '' }: SkeletonLoaderProps) {
  const items = Array.from({ length: count })

  if (variant === 'summary') {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-brand-border bg-white p-4">
            <div className="h-8 w-16 rounded bg-brand-border" />
            <div className="mt-2 h-4 w-24 rounded bg-brand-border" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="space-y-6">
        {items.map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-brand-border bg-white p-6">
            <div className="mb-4 h-6 w-32 rounded bg-brand-border" />
            <div className="space-y-4">
              <div>
                <div className="mb-3 h-4 w-24 rounded bg-brand-border" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="h-8 w-20 rounded-lg bg-brand-border" />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-3 h-4 w-20 rounded bg-brand-border" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-8 w-24 rounded-lg bg-brand-border" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="h-4 animate-pulse rounded bg-brand-border" />
      ))}
    </div>
  )
}
