export type SocialPlatform =
  | 'twitter'
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'twitch'
  | 'discord'
  | 'reddit'
  | 'medium'

export type DomainTLD = '.com' | '.net' | '.org' | '.io' | '.co' | '.dev'

export interface AvailabilityCheckResult {
  username: string
  platforms: Record<SocialPlatform, boolean>
  domains: Record<DomainTLD, boolean>
  checkedAt: string
}

export interface CheckAvailabilityRequest {
  usernames: string[]
}

export interface CheckAvailabilityResponse {
  results: AvailabilityCheckResult[]
  error?: string
  responseTime: number
}
