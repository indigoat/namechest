import type {
  AvailabilityCheckResult,
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
  DomainTLD,
  SocialPlatform,
} from '../models/types'

const PLATFORMS: SocialPlatform[] = [
  'twitter',
  'instagram',
  'tiktok',
  'linkedin',
  'github',
  'youtube',
  'twitch',
  'discord',
  'reddit',
  'medium',
]

const TLDS: DomainTLD[] = ['.com', '.net', '.org', '.io', '.co', '.dev']

const RESERVED_NAMES = {
  twitter: ['twitter', 'support', 'status', 'help', 'blog', 'developer'],
  instagram: ['instagram', 'support', 'about', 'explore', 'help'],
  tiktok: ['tiktok', 'support', 'explore', 'discover'],
  linkedin: ['linkedin', 'jobs', 'help', 'about', 'safety'],
  github: ['github', 'support', 'about', 'github-community', 'github-support'],
  youtube: ['youtube', 'user', 'channel', 'watch', 'results'],
  twitch: ['twitch', 'directory', 'help', 'jobs', 'brand'],
  discord: ['discord', 'support', 'help', 'developers', 'hypesquad'],
  reddit: ['reddit', 'help', 'announcements', 'mods', 'redditmobile'],
  medium: ['medium', 'support', 'help', 'trending', 'about'],
}

function hashUsername(username: string): number {
  let hash = 0
  const normalized = username.toLowerCase().trim()

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return Math.abs(hash)
}

function isReservedName(username: string, platform: SocialPlatform): boolean {
  const normalized = username.toLowerCase().trim()
  return RESERVED_NAMES[platform].includes(normalized)
}

function getAvailability(username: string, platform: SocialPlatform): boolean {
  if (!username || username.trim().length === 0) {
    return false
  }

  if (isReservedName(username, platform)) {
    return false
  }

  const hash = hashUsername(username)
  const availability = hash % 100

  const platformBias: Record<SocialPlatform, number> = {
    twitter: 30,
    instagram: 40,
    tiktok: 50,
    linkedin: 35,
    github: 25,
    youtube: 45,
    twitch: 55,
    discord: 60,
    reddit: 50,
    medium: 40,
  }

  const bias = platformBias[platform]
  return availability < bias
}

function getDomainAvailability(username: string, tld: DomainTLD): boolean {
  if (!username || username.trim().length === 0) {
    return false
  }

  const normalized = username.toLowerCase().trim()

  if (normalized.length < 2) {
    return false
  }

  const hash = hashUsername(username + tld)
  const availability = hash % 100

  const tldBias: Record<DomainTLD, number> = {
    '.com': 20,
    '.net': 40,
    '.org': 50,
    '.io': 30,
    '.co': 35,
    '.dev': 45,
  }

  const bias = tldBias[tld]
  return availability < bias
}

function normalizeUsername(username: string): string {
  return username.trim()
}

export async function checkAvailability(
  request: CheckAvailabilityRequest,
  simulateLatency: boolean = true,
): Promise<CheckAvailabilityResponse> {
  const startTime = performance.now()

  try {
    if (simulateLatency) {
      const delay = Math.random() * 150 + 50
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    const { usernames } = request

    if (!Array.isArray(usernames)) {
      return {
        results: [],
        error: 'Invalid request: usernames must be an array',
        responseTime: performance.now() - startTime,
      }
    }

    if (usernames.length === 0) {
      return {
        results: [],
        error: 'At least one username is required',
        responseTime: performance.now() - startTime,
      }
    }

    if (usernames.length > 100) {
      return {
        results: [],
        error: 'Maximum 100 usernames per request',
        responseTime: performance.now() - startTime,
      }
    }

    const uniqueUsernames = Array.from(
      new Set(usernames.map(normalizeUsername).filter((username) => username.length > 0)),
    )

    const results: AvailabilityCheckResult[] = uniqueUsernames.map((username) => {
      const platforms: Record<SocialPlatform, boolean> = {} as Record<SocialPlatform, boolean>
      const domains: Record<DomainTLD, boolean> = {} as Record<DomainTLD, boolean>

      PLATFORMS.forEach((platform) => {
        platforms[platform] = getAvailability(username, platform)
      })

      TLDS.forEach((tld) => {
        domains[tld] = getDomainAvailability(username, tld)
      })

      return {
        username,
        platforms,
        domains,
        checkedAt: new Date().toISOString(),
      }
    })

    const responseTime = performance.now() - startTime

    return {
      results,
      responseTime,
    }
  } catch (error) {
    return {
      results: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      responseTime: performance.now() - startTime,
    }
  }
}
