import type { AvailabilityCheckResult } from '../models/types'

interface ResultsSummaryProps {
  results: AvailabilityCheckResult[]
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  if (results.length === 0) return null

  const totalPlatforms = results.reduce((sum, result) => {
    return sum + Object.keys(result.platforms).length
  }, 0)

  const totalDomains = results.reduce((sum, result) => {
    return sum + Object.keys(result.domains).length
  }, 0)

  const availablePlatforms = results.reduce((sum, result) => {
    return (
      sum +
      Object.values(result.platforms).filter((available: boolean) => available).length
    )
  }, 0)

  const availableDomains = results.reduce((sum, result) => {
    return (
      sum +
      Object.values(result.domains).filter((available: boolean) => available).length
    )
  }, 0)

  const takenPlatforms = totalPlatforms - availablePlatforms
  const takenDomains = totalDomains - availableDomains

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-xl border border-brand-border bg-white p-4">
        <div className="text-2xl font-bold text-brand-accent">{results.length}</div>
        <div className="mt-1 text-sm text-brand-muted">Username{results.length !== 1 ? 's' : ''} checked</div>
      </div>
      
      <div className="rounded-xl border border-brand-border bg-white p-4">
        <div className="text-2xl font-bold text-green-600">{availablePlatforms}</div>
        <div className="mt-1 text-sm text-brand-muted">Platform{availablePlatforms !== 1 ? 's' : ''} available</div>
      </div>
      
      <div className="rounded-xl border border-brand-border bg-white p-4">
        <div className="text-2xl font-bold text-green-600">{availableDomains}</div>
        <div className="mt-1 text-sm text-brand-muted">Domain{availableDomains !== 1 ? 's' : ''} available</div>
      </div>
      
      <div className="rounded-xl border border-brand-border bg-white p-4">
        <div className="text-2xl font-bold text-red-600">{takenPlatforms + takenDomains}</div>
        <div className="mt-1 text-sm text-brand-muted">Total taken</div>
      </div>
    </div>
  )
}
