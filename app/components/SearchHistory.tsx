import { useState } from 'react'

import type { SearchHistoryEntry } from '../services/searchHistory'
import { clearSearchHistory, getSearchHistory } from '../services/searchHistory'

interface SearchHistoryProps {
  onSelectHistory: (entry: SearchHistoryEntry) => void
}

export function SearchHistory({ onSelectHistory }: SearchHistoryProps) {
  const [history, setHistory] = useState<SearchHistoryEntry[]>(getSearchHistory())
  const [isExpanded, setIsExpanded] = useState(false)

  if (history.length === 0) return null

  const handleClear = () => {
    clearSearchHistory()
    setHistory([])
  }

  const displayedHistory = isExpanded ? history : history.slice(0, 5)

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-brand text-base font-semibold sm:text-lg">Search History</h3>
        <button
          onClick={handleClear}
          className="text-sm text-brand-muted transition hover:text-red-600"
          type="button"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        {displayedHistory.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelectHistory(entry)}
            className="w-full rounded-lg border border-brand-border bg-brand-surface p-3 text-left transition hover:border-brand-accent hover:bg-brand-accent/5"
            type="button"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 truncate">
                <span className="font-medium">{entry.usernames.join(', ')}</span>
              </div>
              <div className="text-xs text-brand-muted">
                {new Date(entry.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-1 text-xs text-brand-muted">
              {entry.results.length} result{entry.results.length !== 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </div>

      {history.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full text-center text-sm text-brand-accent transition hover:underline"
          type="button"
        >
          {isExpanded ? 'Show less' : `Show ${history.length - 5} more`}
        </button>
      )}
    </div>
  )
}
