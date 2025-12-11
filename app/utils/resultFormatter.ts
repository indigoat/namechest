import type { AvailabilityCheckResult } from '../models/types'

export interface FormattedResultRow {
  username: string
  platform: string
  isAvailable: boolean
  type: 'social' | 'domain'
  domain?: string
}

export function flattenResultsForExport(
  results: AvailabilityCheckResult[],
): FormattedResultRow[] {
  const flattened: FormattedResultRow[] = []

  results.forEach((result) => {
    // Add platform results
    Object.entries(result.platforms).forEach(([platform, isAvailable]) => {
      flattened.push({
        username: result.username,
        platform,
        isAvailable,
        type: 'social',
      })
    })

    // Add domain results
    Object.entries(result.domains).forEach(([domain, isAvailable]) => {
      flattened.push({
        username: result.username,
        platform: `${result.username}${domain}`,
        isAvailable,
        type: 'domain',
        domain,
      })
    })
  })

  return flattened
}

export function convertToCSV(results: AvailabilityCheckResult[]): string {
  const flattened = flattenResultsForExport(results)

  const headers = ['Username', 'Platform/Domain', 'Available', 'Type']
  const rows = flattened.map((row) => [
    `"${row.username}"`,
    `"${row.platform}"`,
    row.isAvailable ? 'Yes' : 'No',
    row.type,
  ])

  return [headers, ...rows].map((row) => row.join(',')).join('\n')
}

export function convertToJSON(results: AvailabilityCheckResult[]): string {
  return JSON.stringify(results, null, 2)
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain',
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function getExportFilename(
  format: 'csv' | 'json',
  usernames?: string[],
): string {
  const timestamp = new Date().toISOString().split('T')[0]
  const usernameStr = usernames && usernames.length > 0 ? usernames.join('-') : 'results'
  return `${usernameStr}-${timestamp}.${format}`
}
