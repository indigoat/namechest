import { useEffect, useState } from 'react'

import type { AvailabilityCheckResult } from '../models/types'
import {
  clearAllResultSnapshots,
  deleteResultSnapshot,
  getResultSnapshots,
  type ResultSnapshot,
  updateResultSnapshotName,
} from '../services/resultSnapshots'

interface SavedSnapshotsProps {
  onSelectSnapshot: (results: AvailabilityCheckResult[], usernames: string[]) => void
}

export function SavedSnapshots({ onSelectSnapshot }: SavedSnapshotsProps) {
  const [snapshots, setSnapshots] = useState<ResultSnapshot[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadSnapshots()
  }, [])

  const loadSnapshots = () => {
    const stored = getResultSnapshots()
    setSnapshots(stored)
  }

  const handleDelete = (id: string) => {
    deleteResultSnapshot(id)
    loadSnapshots()
  }

  const handleRename = (id: string, newName: string) => {
    updateResultSnapshotName(id, newName)
    setEditingId(null)
    loadSnapshots()
  }

  const handleClearAll = () => {
    if (window.confirm('Delete all saved snapshots? This cannot be undone.')) {
      clearAllResultSnapshots()
      loadSnapshots()
    }
  }

  const handleSelect = (snapshot: ResultSnapshot) => {
    onSelectSnapshot(snapshot.results, snapshot.usernames)
  }

  if (snapshots.length === 0) return null

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-md sm:p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between"
        type="button"
        aria-expanded={isExpanded}
        aria-label="Toggle saved snapshots"
      >
        <h2 className="font-brand text-base font-semibold sm:text-lg">
          Saved Snapshots ({snapshots.length})
        </h2>
        <svg
          className={`h-5 w-5 transition ${isExpanded ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          {snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="flex flex-col gap-3 rounded-lg border border-brand-border bg-brand-surface p-3 sm:flex-row sm:items-center"
            >
              <button
                onClick={() => handleSelect(snapshot)}
                className="flex-1 text-left transition hover:text-brand-accent"
                title={`Load snapshot: ${snapshot.name}`}
                type="button"
              >
                <div className="font-medium text-brand-fg">
                  {editingId === snapshot.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 rounded border border-brand-border bg-white px-2 py-1 text-sm outline-none"
                        autoFocus
                        aria-label="Edit snapshot name"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRename(snapshot.id, editingName || snapshot.name || 'Snapshot')
                        }}
                        className="text-green-600 hover:text-green-700"
                        title="Save name"
                        type="button"
                      >
                        ✓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(null)
                        }}
                        className="text-gray-600 hover:text-gray-700"
                        title="Cancel"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{snapshot.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(snapshot.id)
                          setEditingName(snapshot.name || '')
                        }}
                        className="text-xs text-brand-muted hover:text-brand-fg"
                        title="Edit name"
                        type="button"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-xs text-brand-muted">
                  {snapshot.usernames.join(', ')} •{' '}
                  {new Date(snapshot.timestamp).toLocaleString()}
                </div>
              </button>
              <button
                onClick={() => handleDelete(snapshot.id)}
                className="text-red-600 hover:text-red-700"
                title="Delete snapshot"
                aria-label={`Delete snapshot: ${snapshot.name}`}
                type="button"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}

          {snapshots.length > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-3 w-full rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              title="Delete all snapshots"
              aria-label="Delete all snapshots"
              type="button"
            >
              Clear All Snapshots
            </button>
          )}
        </div>
      )}
    </div>
  )
}
