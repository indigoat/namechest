import type { AvailabilityCheckResult } from '../models/types'

interface AvailabilityResultsProps {
  results: AvailabilityCheckResult[]
}

export function AvailabilityResults({ results }: AvailabilityResultsProps) {
  if (results.length === 0) return null

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div
          key={result.username}
          className="rounded-2xl border border-brand-border bg-white p-6 shadow-soft"
        >
          <div className="mb-4 flex items-baseline gap-2">
            <h3 className="font-brand text-xl font-semibold">{result.username}</h3>
            <span className="text-sm text-brand-muted">
              {new Date(result.checkedAt).toLocaleString()}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-muted">
                Social Platforms
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.platforms).map(([platform, available]) => (
                  <div
                    key={platform}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      available
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {platform} {available ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-muted">
                Domains
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.domains).map(([domain, available]) => (
                  <div
                    key={domain}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      available
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {result.username}
                    {domain} {available ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
