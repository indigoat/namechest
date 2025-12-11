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
    <div 
      className="sticky top-[52px] z-10 -mx-4 bg-gradient-to-b from-[#f7f7fb] via-[#f7f7fb] to-transparent px-4 pb-4 pt-2 backdrop-blur-sm sm:-mx-0 sm:top-16 sm:px-0"
      role="region"
      aria-label="Results summary"
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-brand-border bg-white p-3 shadow-md sm:p-4">
          <div className="text-xl font-bold text-brand-accent sm:text-2xl">{results.length}</div>
          <div className="mt-1 text-xs text-brand-muted sm:text-sm">
            Username{results.length !== 1 ? 's' : ''} checked
          </div>
        </div>
        
        <div className="rounded-xl border border-brand-border bg-white p-3 shadow-md sm:p-4">
          <div className="text-xl font-bold text-green-600 sm:text-2xl">{availablePlatforms}</div>
          <div className="mt-1 text-xs text-brand-muted sm:text-sm">
            Platform{availablePlatforms !== 1 ? 's' : ''} available
          </div>
        </div>
        
        <div className="rounded-xl border border-brand-border bg-white p-3 shadow-md sm:p-4">
          <div className="text-xl font-bold text-green-600 sm:text-2xl">{availableDomains}</div>
          <div className="mt-1 text-xs text-brand-muted sm:text-sm">
            Domain{availableDomains !== 1 ? 's' : ''} available
          </div>
        </div>
        
        <div className="rounded-xl border border-brand-border bg-white p-3 shadow-md sm:p-4">
          <div className="text-xl font-bold text-red-600 sm:text-2xl">{takenPlatforms + takenDomains}</div>
          <div className="mt-1 text-xs text-brand-muted sm:text-sm">Total taken</div>
        </div>
      </div>
    </div>
  )
}
