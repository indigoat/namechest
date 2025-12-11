import { useState } from 'react'

import type { AvailabilityCheckResult } from '../models/types'
import { saveResultSnapshot } from '../services/resultSnapshots'
import {
  convertToCSV,
  convertToJSON,
  downloadFile,
  getExportFilename,
} from '../utils/resultFormatter'

interface ResultsActionsProps {
  results: AvailabilityCheckResult[]
  usernames: string[]
}

export function ResultsActions({ results, usernames }: ResultsActionsProps) {
  const [showSnapshotInput, setShowSnapshotInput] = useState(false)
  const [snapshotName, setSnapshotName] = useState('')

  const handleExportCSV = () => {
    const csv = convertToCSV(results)
    const filename = getExportFilename('csv', usernames)
    downloadFile(csv, filename, 'text/csv')
  }

  const handleExportJSON = () => {
    const json = convertToJSON(results)
    const filename = getExportFilename('json', usernames)
    downloadFile(json, filename, 'application/json')
  }

  const handleSaveSnapshot = () => {
    const name =
      snapshotName.trim() ||
      `Results - ${new Date().toLocaleString()}`
    try {
      saveResultSnapshot(usernames, results, name)
      setSnapshotName('')
      setShowSnapshotInput(false)
    } catch (error) {
      console.error('Failed to save snapshot:', error)
    }
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 sm:flex-none"
            title="Download results as CSV"
            aria-label="Export to CSV"
            type="button"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100 sm:flex-none"
            title="Download results as JSON"
            aria-label="Export to JSON"
            type="button"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>JSON</span>
          </button>
        </div>

        <div className="hidden border-l border-brand-border sm:block" />

        <div className="flex-1">
          {!showSnapshotInput ? (
            <button
              onClick={() => setShowSnapshotInput(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 sm:w-auto"
              title="Save results snapshot"
              aria-label="Save snapshot"
              type="button"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
              <span>Save Snapshot</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="Snapshot name (optional)"
                className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm outline-none ring-brand-accent/40 transition focus:ring-2 sm:w-auto sm:flex-1"
                aria-label="Snapshot name"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSnapshot}
                  className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 sm:flex-none"
                  title="Confirm snapshot"
                  aria-label="Confirm save"
                  type="button"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setShowSnapshotInput(false)
                    setSnapshotName('')
                  }}
                  className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 sm:flex-none"
                  title="Cancel"
                  aria-label="Cancel snapshot"
                  type="button"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
