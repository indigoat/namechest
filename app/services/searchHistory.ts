import type { AvailabilityCheckResult } from '../models/types'

export interface SearchHistoryEntry {
  id: string
  usernames: string[]
  results: AvailabilityCheckResult[]
  timestamp: string
}

const STORAGE_KEY = 'namecheck_search_history'
const MAX_HISTORY_ITEMS = 20

export function getSearchHistory(): SearchHistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addToSearchHistory(usernames: string[], results: AvailabilityCheckResult[]): void {
  try {
    const history = getSearchHistory()
    const entry: SearchHistoryEntry = {
      id: crypto.randomUUID(),
      usernames,
      results,
      timestamp: new Date().toISOString(),
    }
    const updated = [entry, ...history].slice(0, MAX_HISTORY_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save search history:', error)
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear search history:', error)
  }
}
