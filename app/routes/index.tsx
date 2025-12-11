import { createRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { ResultsActions } from '../components/ResultsActions'
import { ResultsGrid } from '../components/ResultsGrid'
import { ResultsSummary } from '../components/ResultsSummary'
import { SavedSnapshots } from '../components/SavedSnapshots'
import { SearchHistory } from '../components/SearchHistory'
import { SkeletonLoader } from '../components/SkeletonLoader'
import { UsernameChip } from '../components/UsernameChip'
import { useAvailabilityCheck } from '../hooks/useAvailabilityCheck'
import { useDebounce } from '../hooks/useDebounce'
import type { AvailabilityCheckResult } from '../models/types'
import { addToSearchHistory, type SearchHistoryEntry } from '../services/searchHistory'
import { parseUsernamesFromInput, validateUsernames } from '../utils/inputParser'
import { Route as RootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: HomePage,
})

function HomePage() {
  const [inputValue, setInputValue] = useState('')
  const [parsedUsernames, setParsedUsernames] = useState<string[]>([])
  const [results, setResults] = useState<AvailabilityCheckResult[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [historyKey, setHistoryKey] = useState(0)

  const debouncedInput = useDebounce(inputValue, 500)
  const mutation = useAvailabilityCheck()

  useEffect(() => {
    const usernames = parseUsernamesFromInput(debouncedInput)
    setParsedUsernames(usernames)

    if (usernames.length > 0) {
      const validation = validateUsernames(usernames)
      setValidationErrors(validation.errors)
    } else {
      setValidationErrors([])
    }
  }, [debouncedInput])

  const handleSearch = async () => {
    const validation = validateUsernames(parsedUsernames)

    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    setValidationErrors([])

    mutation.mutate(validation.validUsernames, {
      onSuccess: (data) => {
        if (data.error) {
          setValidationErrors([data.error])
        } else {
          setResults(data.results)
          addToSearchHistory(validation.validUsernames, data.results)
          setHistoryKey((prev) => prev + 1)
        }
      },
      onError: (error) => {
        setValidationErrors([error.message || 'Failed to check availability'])
      },
    })
  }

  const handleRemoveChip = (username: string) => {
    const newUsernames = parsedUsernames.filter((u) => u !== username)
    const newInput = newUsernames.join(', ')
    setInputValue(newInput)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSelectHistory = (entry: SearchHistoryEntry) => {
    setInputValue(entry.usernames.join(', '))
    setResults(entry.results)
  }

  const handleSelectSnapshot = (
    snapshotResults: AvailabilityCheckResult[],
    snapshotUsernames: string[],
  ) => {
    setInputValue(snapshotUsernames.join(', '))
    setResults(snapshotResults)
  }

  const isSearchDisabled = parsedUsernames.length === 0 || mutation.isPending

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-brand text-2xl tracking-tight sm:text-3xl lg:text-4xl">
          Username & Domain Checker
        </h1>
        <p className="text-sm text-brand-muted sm:max-w-prose sm:text-base">
          Check availability of usernames across social platforms and domains. Enter one or more
          names separated by commas or new lines.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-md sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="query">
              Username(s) to check
            </label>
            <textarea
              className="mt-2 w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-base outline-none ring-brand-accent/40 transition focus:ring-4"
              id="query"
              placeholder="Enter usernames separated by commas or new lines&#10;e.g., techstartup, innovate, mybrand"
              rows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={mutation.isPending}
            />
          </div>

          {parsedUsernames.length > 0 && (
            <div>
              <div className="mb-2 text-sm font-medium text-brand-muted">
                Parsed usernames ({parsedUsernames.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {parsedUsernames.map((username) => (
                  <UsernameChip
                    key={username}
                    username={username}
                    onRemove={handleRemoveChip}
                  />
                ))}
              </div>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="rounded-lg bg-red-50 p-3">
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm text-red-700">
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-accent px-6 font-medium text-white shadow-md transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              type="button"
              onClick={handleSearch}
              disabled={isSearchDisabled}
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Checking...
                </>
              ) : (
                'Check Availability'
              )}
            </button>

            {mutation.data && (
              <span className="text-xs text-brand-muted sm:text-sm">
                Response time: {mutation.data.responseTime.toFixed(0)}ms
              </span>
            )}
          </div>

          <p className="text-sm text-brand-muted">
            Tip: Press <kbd className="rounded bg-brand-surface px-2 py-0.5 font-mono text-xs">Cmd/Ctrl + Enter</kbd> to search
          </p>
        </div>
      </div>

      {mutation.isPending && (
        <div className="space-y-6" role="status" aria-live="polite" aria-label="Loading results">
          <SkeletonLoader variant="summary" />
          <div className="h-16 animate-pulse rounded-xl bg-white" />
          <SkeletonLoader variant="card" count={parsedUsernames.length} />
        </div>
      )}

      {!mutation.isPending && results.length > 0 && (
        <div className="space-y-6">
          <ResultsSummary results={results} />
          <ResultsActions results={results} usernames={parsedUsernames} />
          <ResultsGrid results={results} />
        </div>
      )}

      <SavedSnapshots onSelectSnapshot={handleSelectSnapshot} />

      <SearchHistory key={historyKey} onSelectHistory={handleSelectHistory} />
    </div>
  )
}
