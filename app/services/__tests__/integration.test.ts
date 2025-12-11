import { checkAvailability } from '../mockAvailability'
import type { CheckAvailabilityRequest } from '../../models/types'

export async function runIntegrationTests(): Promise<
  { name: string; passed: boolean; error?: string }[]
> {
  const results: { name: string; passed: boolean; error?: string }[] = []

  async function test(name: string, fn: () => Promise<void>): Promise<void> {
    try {
      await fn()
      results.push({ name, passed: true })
    } catch (error) {
      results.push({
        name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  await test('API: POST endpoint structure', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['testuser'],
    }

    const response = await checkAvailability(request, false)

    if (!response.results || !Array.isArray(response.results)) {
      throw new Error('Response should have results array')
    }
    if (typeof response.responseTime !== 'number') {
      throw new Error('Response should have responseTime number')
    }
  })

  await test('API: Handle single username request', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['johndoe'],
    }

    const response = await checkAvailability(request, false)

    if (response.results.length !== 1) {
      throw new Error('Should return 1 result')
    }
    if (response.results[0]?.username !== 'johndoe') {
      throw new Error('Username should match request')
    }
  })

  await test('API: Handle multiple usernames', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['alice', 'bob', 'charlie', 'dave', 'eve'],
    }

    const response = await checkAvailability(request, false)

    if (response.results.length !== 5) {
      throw new Error('Should return 5 results')
    }
  })

  await test('API: Error on empty request', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: [],
    }

    const response = await checkAvailability(request, false)

    if (!response.error) {
      throw new Error('Should return error for empty request')
    }
    if (response.results.length !== 0) {
      throw new Error('Should return empty results on error')
    }
  })

  await test('API: Reject non-array usernames', async () => {
    const request = {
      usernames: 'not-an-array',
    } as unknown as CheckAvailabilityRequest

    const response = await checkAvailability(request, false)

    if (!response.error) {
      throw new Error('Should return error for non-array usernames')
    }
  })

  await test('API: Reject more than 100 usernames', async () => {
    const usernames = Array.from({ length: 101 }, (_, i) => `user${i}`)
    const request: CheckAvailabilityRequest = { usernames }

    const response = await checkAvailability(request, false)

    if (!response.error) {
      throw new Error('Should return error for > 100 usernames')
    }
  })

  await test('Response format: Platform object structure', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['testuser'],
    }

    const response = await checkAvailability(request, false)
    const result = response.results[0]

    const expectedPlatforms = ['twitter', 'instagram', 'tiktok', 'linkedin', 'github', 'youtube', 'twitch', 'discord', 'reddit', 'medium']

    expectedPlatforms.forEach((platform) => {
      if (!(platform in (result?.platforms || {}))) {
        throw new Error(`Missing platform: ${platform}`)
      }
    })
  })

  await test('Response format: Domain object structure', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['testuser'],
    }

    const response = await checkAvailability(request, false)
    const result = response.results[0]

    const expectedDomains = ['.com', '.net', '.org', '.io', '.co', '.dev']

    expectedDomains.forEach((domain) => {
      if (!(domain in (result?.domains || {}))) {
        throw new Error(`Missing domain: ${domain}`)
      }
    })
  })

  await test('Response format: Timestamp included', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['testuser'],
    }

    const response = await checkAvailability(request, false)
    const result = response.results[0]

    if (!result?.checkedAt) {
      throw new Error('Missing checkedAt timestamp')
    }

    const timestamp = new Date(result.checkedAt)
    if (isNaN(timestamp.getTime())) {
      throw new Error('checkedAt should be valid ISO date')
    }
  })

  await test('Behavior: Deterministic results', async () => {
    const request: CheckAvailabilityRequest = { usernames: ['stable'] }

    const response1 = await checkAvailability(request, false)
    const response2 = await checkAvailability(request, false)

    const result1 = response1.results[0]
    const result2 = response2.results[0]

    if (JSON.stringify(result1?.platforms) !== JSON.stringify(result2?.platforms)) {
      throw new Error('Same username should produce same results')
    }
  })

  await test('Behavior: Case insensitive normalization', async () => {
    const response1 = await checkAvailability({ usernames: ['TestUser'] }, false)
    const response2 = await checkAvailability({ usernames: ['testuser'] }, false)

    const username1 = response1.results[0]?.username
    const username2 = response2.results[0]?.username

    if (username1 !== username2 || username2 !== 'testuser') {
      throw new Error('Usernames should be normalized to lowercase')
    }
  })

  await test('Behavior: Deduplication', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['john', 'JOHN', 'john', 'jane'],
    }

    const response = await checkAvailability(request, false)

    if (response.results.length !== 2) {
      throw new Error('Should deduplicate case-insensitively')
    }

    const usernames = response.results.map((r) => r.username)
    if (!usernames.includes('john') || !usernames.includes('jane')) {
      throw new Error('Should preserve one instance of each unique username')
    }
  })

  await test('Behavior: Empty string filtering', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['', '  ', 'valid', '\t'],
    }

    const response = await checkAvailability(request, false)

    if (response.results.length !== 1) {
      throw new Error('Should filter out empty/whitespace-only usernames')
    }
    if (response.results[0]?.username !== 'valid') {
      throw new Error('Should preserve valid usernames')
    }
  })

  await test('Behavior: Reserved names unavailable', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['twitter', 'instagram'],
    }

    const response = await checkAvailability(request, false)

    const twitter = response.results.find((r) => r.username === 'twitter')
    const instagram = response.results.find((r) => r.username === 'instagram')

    if (twitter?.platforms.twitter !== false) {
      throw new Error('Reserved name "twitter" should be unavailable on Twitter')
    }
    if (instagram?.platforms.instagram !== false) {
      throw new Error('Reserved name "instagram" should be unavailable on Instagram')
    }
  })

  await test('Behavior: Short domains unavailable', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['x'],
    }

    const response = await checkAvailability(request, false)
    const result = response.results[0]

    Object.entries(result?.domains || {}).forEach(([domain, available]) => {
      if (available !== false) {
        throw new Error(`Single character username should not have available domain: ${domain}`)
      }
    })
  })

  await test('Performance: Latency simulation', async () => {
    const request: CheckAvailabilityRequest = {
      usernames: ['testuser'],
    }

    const response = await checkAvailability(request, true)

    if (response.responseTime < 30) {
      throw new Error('With latency simulation, response time should be > 30ms')
    }
  })

  return results
}
