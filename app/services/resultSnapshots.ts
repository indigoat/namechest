import type { AvailabilityCheckResult } from '../models/types'

export interface ResultSnapshot {
  id: string
  usernames: string[]
  results: AvailabilityCheckResult[]
  timestamp: string
  name?: string
}

const STORAGE_KEY = 'namecheck_result_snapshots'
const MAX_SNAPSHOTS = 50

export function getResultSnapshots(): ResultSnapshot[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveResultSnapshot(
  usernames: string[],
  results: AvailabilityCheckResult[],
  name?: string,
): ResultSnapshot {
  try {
    const snapshots = getResultSnapshots()
    const snapshot: ResultSnapshot = {
      id: crypto.randomUUID(),
      usernames,
      results,
      timestamp: new Date().toISOString(),
      name: name || `Results - ${new Date().toLocaleString()}`,
    }
    const updated = [snapshot, ...snapshots].slice(0, MAX_SNAPSHOTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return snapshot
  } catch (error) {
    console.error('Failed to save result snapshot:', error)
    throw error
  }
}

export function deleteResultSnapshot(id: string): void {
  try {
    const snapshots = getResultSnapshots()
    const updated = snapshots.filter((snapshot) => snapshot.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to delete result snapshot:', error)
  }
}

export function updateResultSnapshotName(id: string, name: string): void {
  try {
    const snapshots = getResultSnapshots()
    const updated = snapshots.map((snapshot) =>
      snapshot.id === id ? { ...snapshot, name } : snapshot,
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to update result snapshot name:', error)
  }
}

export function clearAllResultSnapshots(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear result snapshots:', error)
  }
}
