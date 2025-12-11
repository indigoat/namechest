import { useState } from 'react'

import type { AvailabilityCheckResult } from '../models/types'
import { StatusBadge } from './StatusBadge'

type ViewMode = 'grid' | 'list'
type GroupMode = 'combined' | 'social' | 'domains'

interface ResultsGridProps {
  results: AvailabilityCheckResult[]
  onlyAvailable?: boolean
}

export function ResultsGrid({ results, onlyAvailable = false }: ResultsGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [groupMode, setGroupMode] = useState<GroupMode>('combined')
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(onlyAvailable)

  if (results.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-xl border border-brand-border bg-white p-4 shadow-md sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              viewMode === 'grid'
                ? 'bg-brand-accent text-white'
                : 'bg-brand-surface text-brand-fg hover:bg-brand-border'
            }`}
            title="Grid view"
            aria-label="Switch to grid view"
            type="button"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              viewMode === 'list'
                ? 'bg-brand-accent text-white'
                : 'bg-brand-surface text-brand-fg hover:bg-brand-border'
            }`}
            title="List view"
            aria-label="Switch to list view"
            type="button"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="hidden border-l border-brand-border sm:block" />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setGroupMode('combined')}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
              groupMode === 'combined'
                ? 'bg-brand-accent text-white'
                : 'bg-brand-surface text-brand-fg hover:bg-brand-border'
            }`}
            title="Show all results"
            aria-label="Show combined view"
            type="button"
          >
            Combined
          </button>
          <button
            onClick={() => setGroupMode('social')}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
              groupMode === 'social'
                ? 'bg-brand-accent text-white'
                : 'bg-brand-surface text-brand-fg hover:bg-brand-border'
            }`}
            title="Show social platforms only"
            aria-label="Show social platforms"
            type="button"
          >
            Social
          </button>
          <button
            onClick={() => setGroupMode('domains')}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
              groupMode === 'domains'
                ? 'bg-brand-accent text-white'
                : 'bg-brand-surface text-brand-fg hover:bg-brand-border'
            }`}
            title="Show domains only"
            aria-label="Show domains"
            type="button"
          >
            Domains
          </button>
        </div>

        <div className="hidden border-l border-brand-border sm:block" />

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            className="rounded border-brand-border"
            aria-label="Show only available items"
          />
          <span className="text-sm font-medium text-brand-fg">Available only</span>
        </label>
      </div>

      {/* Results Container */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          {results.map((result) => (
            <ResultCard
              key={result.username}
              result={result}
              groupMode={groupMode}
              showOnlyAvailable={showOnlyAvailable}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface">
                <th className="px-4 py-3 text-left text-sm font-semibold text-brand-fg">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-brand-fg">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-brand-fg">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <ResultTableRows
                  key={result.username}
                  result={result}
                  groupMode={groupMode}
                  showOnlyAvailable={showOnlyAvailable}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

interface ResultCardProps {
  result: AvailabilityCheckResult
  groupMode: GroupMode
  showOnlyAvailable: boolean
}

function ResultCard({ result, groupMode, showOnlyAvailable }: ResultCardProps) {
  const shouldShowPlatforms =
    groupMode === 'combined' || groupMode === 'social'
  const shouldShowDomains =
    groupMode === 'combined' || groupMode === 'domains'

  const filteredPlatforms = shouldShowPlatforms
    ? Object.entries(result.platforms).filter(
        ([, available]) => !showOnlyAvailable || available,
      )
    : []

  const filteredDomains = shouldShowDomains
    ? Object.entries(result.domains).filter(
        ([, available]) => !showOnlyAvailable || available,
      )
    : []

  if (filteredPlatforms.length === 0 && filteredDomains.length === 0) {
    return null
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-md transition-shadow hover:shadow-lg sm:p-6">
      <h3 className="mb-4 font-brand text-lg font-semibold sm:text-xl">{result.username}</h3>

      <div className="space-y-4">
        {shouldShowPlatforms && filteredPlatforms.length > 0 && (
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted sm:text-sm">
              Social Platforms
            </h4>
            <div className="flex flex-wrap gap-2">
              {filteredPlatforms.map(([platform, available]) => (
                <StatusBadge
                  key={platform}
                  isAvailable={available}
                  label={platform}
                />
              ))}
            </div>
          </div>
        )}

        {shouldShowDomains && filteredDomains.length > 0 && (
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted sm:text-sm">
              Domains
            </h4>
            <div className="flex flex-wrap gap-2">
              {filteredDomains.map(([domain, available]) => (
                <StatusBadge
                  key={domain}
                  isAvailable={available}
                  label={`${result.username}${domain}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ResultTableRowsProps {
  result: AvailabilityCheckResult
  groupMode: GroupMode
  showOnlyAvailable: boolean
}

function ResultTableRows({
  result,
  groupMode,
  showOnlyAvailable,
}: ResultTableRowsProps) {
  const rows: Array<{ item: string; available: boolean }> = []

  if (groupMode === 'combined' || groupMode === 'social') {
    Object.entries(result.platforms).forEach(([platform, available]) => {
      if (!showOnlyAvailable || available) {
        rows.push({ item: platform, available })
      }
    })
  }

  if (groupMode === 'combined' || groupMode === 'domains') {
    Object.entries(result.domains).forEach(([domain, available]) => {
      if (!showOnlyAvailable || available) {
        rows.push({ item: `${result.username}${domain}`, available })
      }
    })
  }

  if (rows.length === 0) return null

  return (
    <>
      {rows.map((row, index) => (
        <tr
          key={`${result.username}-${row.item}`}
          className={`border-b border-brand-border ${
            index % 2 === 0 ? 'bg-white' : 'bg-brand-bg'
          }`}
        >
          <td className="px-4 py-3 text-sm font-medium text-brand-fg">
            {result.username}
          </td>
          <td className="px-4 py-3 text-sm text-brand-fg">{row.item}</td>
          <td className="px-4 py-3 text-sm">
            <StatusBadge
              isAvailable={row.available}
              label={row.available ? 'Available' : 'Taken'}
            />
          </td>
        </tr>
      ))}
    </>
  )
}
