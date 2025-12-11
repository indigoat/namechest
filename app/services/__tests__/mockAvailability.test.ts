import { checkAvailability } from '../mockAvailability'
import type { CheckAvailabilityRequest } from '../../models/types'

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`)
  }
}

function assertTrue(value: boolean, message: string): void {
  if (!value) {
    throw new Error(message)
  }
}

function assertFalse(value: boolean, message: string): void {
  if (value) {
    throw new Error(message)
  }
}

function assertDefined<T>(value: T | undefined, message: string): asserts value is T {
  if (value === undefined) {
    throw new Error(message)
  }
}

function assertLength<T extends { length: number }>(arr: T, expected: number, message: string): void {
  if (arr.length !== expected) {
    throw new Error(`${message}\nExpected length: ${expected}\nActual length: ${arr.length}`)
  }
}

interface TestResult {
  name: string
  passed: boolean
  error?: string
}

const results: TestResult[] = []

function test(name: string, fn: () => Promise<void> | void): void {
  try {
    const result = fn()
    if (result instanceof Promise) {
      result
        .then(() => {
          results.push({ name, passed: true })
        })
        .catch((error) => {
          results.push({ name, passed: false, error: error.message })
        })
    } else {
      results.push({ name, passed: true })
    }
  } catch (error) {
    results.push({ name, passed: false, error: error instanceof Error ? error.message : String(error) })
  }
}

test('Basic functionality: single username returns results', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['johndoe'],
  }

  const response = await checkAvailability(request, false)

  assertFalse(!!response.error, 'Should not have error')
  assertLength(response.results, 1, 'Should have 1 result')
  assertEqual(response.results[0]?.username, 'johndoe', 'Username should match')
  assertDefined(response.results[0]?.platforms, 'Platforms should be defined')
  assertDefined(response.results[0]?.domains, 'Domains should be defined')
  assertDefined(response.results[0]?.checkedAt, 'CheckedAt should be defined')
})

test('Basic functionality: all platforms included in response', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)
  const result = response.results[0]

  assertDefined(result, 'Result should be defined')
  const platforms = ['twitter', 'instagram', 'tiktok', 'linkedin', 'github', 'youtube', 'twitch', 'discord', 'reddit', 'medium']
  platforms.forEach((platform) => {
    assertTrue(platform in (result?.platforms || {}), `Platform ${platform} should be in result`)
  })
})

test('Basic functionality: all TLDs included in response', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)
  const result = response.results[0]

  assertDefined(result, 'Result should be defined')
  const tlds = ['.com', '.net', '.org', '.io', '.co', '.dev']
  tlds.forEach((tld) => {
    assertTrue(tld in (result?.domains || {}), `TLD ${tld} should be in result`)
  })
})

test('Basic functionality: availability values are booleans', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)
  const result = response.results[0]

  Object.values(result?.platforms || {}).forEach((value) => {
    assertTrue(typeof value === 'boolean', 'Platform value should be boolean')
  })

  Object.values(result?.domains || {}).forEach((value) => {
    assertTrue(typeof value === 'boolean', 'Domain value should be boolean')
  })
})

test('Deterministic behavior: same username returns same results', async () => {
  const request1: CheckAvailabilityRequest = { usernames: ['johndoe'] }
  const request2: CheckAvailabilityRequest = { usernames: ['johndoe'] }

  const response1 = await checkAvailability(request1, false)
  const response2 = await checkAvailability(request2, false)

  assertEqual(response1.results[0], response2.results[0], 'Results should be identical')
})

test('Deterministic behavior: case-insensitive matching', async () => {
  const request1: CheckAvailabilityRequest = { usernames: ['JohnDoe'] }
  const request2: CheckAvailabilityRequest = { usernames: ['johndoe'] }

  const response1 = await checkAvailability(request1, false)
  const response2 = await checkAvailability(request2, false)

  assertEqual(response1.results[0]?.platforms, response2.results[0]?.platforms, 'Platforms should match')
  assertEqual(response1.results[0]?.domains, response2.results[0]?.domains, 'Domains should match')
})

test('Deterministic behavior: whitespace trimmed', async () => {
  const request1: CheckAvailabilityRequest = { usernames: ['  johndoe  '] }
  const request2: CheckAvailabilityRequest = { usernames: ['johndoe'] }

  const response1 = await checkAvailability(request1, false)
  const response2 = await checkAvailability(request2, false)

  assertEqual(response1.results[0]?.platforms, response2.results[0]?.platforms, 'Platforms should match after trimming')
  assertEqual(response1.results[0]?.domains, response2.results[0]?.domains, 'Domains should match after trimming')
})

test('Duplicate handling: duplicates are deduplicated', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['john', 'john', 'john', 'jane'],
  }

  const response = await checkAvailability(request, false)

  assertLength(response.results, 2, 'Should have 2 unique results')
  const usernames = response.results.map((r) => r.username)
  assertTrue(usernames.includes('john'), 'Should include john')
  assertTrue(usernames.includes('jane'), 'Should include jane')
})

test('Duplicate handling: case-insensitive deduplication', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['John', 'JOHN', 'john'],
  }

  const response = await checkAvailability(request, false)

  assertLength(response.results, 1, 'Should have 1 result after case-insensitive deduplication')
  assertEqual(response.results[0]?.username, 'john', 'Username should be lowercase')
})

test('Edge cases: empty array returns error', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: [],
  }

  const response = await checkAvailability(request, false)

  assertDefined(response.error, 'Should have error')
  assertLength(response.results, 0, 'Should have no results')
})

test('Edge cases: non-array input returns error', async () => {
  const request = {
    usernames: 'not-an-array',
  } as unknown as CheckAvailabilityRequest

  const response = await checkAvailability(request, false)

  assertDefined(response.error, 'Should have error')
  assertLength(response.results, 0, 'Should have no results')
})

test('Edge cases: more than 100 usernames returns error', async () => {
  const usernames = Array.from({ length: 101 }, (_, i) => `user${i}`)
  const request: CheckAvailabilityRequest = { usernames }

  const response = await checkAvailability(request, false)

  assertDefined(response.error, 'Should have error')
  assertLength(response.results, 0, 'Should have no results')
})

test('Edge cases: empty string usernames are filtered', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['', '  ', 'validuser'],
  }

  const response = await checkAvailability(request, false)

  assertLength(response.results, 1, 'Should have 1 valid result')
  assertEqual(response.results[0]?.username, 'validuser', 'Should only have validuser')
})

test('Edge cases: reserved names are unavailable', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['twitter', 'instagram', 'github'],
  }

  const response = await checkAvailability(request, false)

  const twitterResult = response.results.find((r) => r.username === 'twitter')
  const instagramResult = response.results.find((r) => r.username === 'instagram')
  const githubResult = response.results.find((r) => r.username === 'github')

  assertFalse(twitterResult?.platforms.twitter || false, 'Twitter reserved name should be unavailable')
  assertFalse(instagramResult?.platforms.instagram || false, 'Instagram reserved name should be unavailable')
  assertFalse(githubResult?.platforms.github || false, 'GitHub reserved name should be unavailable')
})

test('Edge cases: short usernames have unavailable domains', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['a'],
  }

  const response = await checkAvailability(request, false)
  const result = response.results[0]

  Object.values(result?.domains || {}).forEach((availability) => {
    assertFalse(availability, 'Single character domains should be unavailable')
  })
})

test('Timestamp: includes ISO timestamp', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)
  const result = response.results[0]
  const timestamp = result?.checkedAt

  assertDefined(timestamp, 'Should have timestamp')
  assertTrue(new Date(timestamp!).getTime() > 0, 'Timestamp should be valid ISO date')
})

test('Response time: includes response time metric', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)

  assertTrue(response.responseTime >= 0, 'Response time should be non-negative')
  assertTrue(typeof response.responseTime === 'number', 'Response time should be a number')
})

test('Response time: minimal latency without simulation', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)

  assertTrue(response.responseTime < 50, 'Response time should be minimal without simulation')
})

test('Response time: added latency with simulation', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, true)

  assertTrue(response.responseTime > 30, 'Response time should include simulated latency')
})

test('Multiple usernames: handles multiple different usernames', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['alice', 'bob', 'charlie'],
  }

  const response = await checkAvailability(request, false)

  assertLength(response.results, 3, 'Should have 3 results')
  const usernames = response.results.map((r) => r.username)
  assertTrue(usernames.includes('alice'), 'Should include alice')
  assertTrue(usernames.includes('bob'), 'Should include bob')
  assertTrue(usernames.includes('charlie'), 'Should include charlie')
})

test('Multiple usernames: no cross-contamination', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['user1', 'user2', 'user3'],
  }

  const response = await checkAvailability(request, false)

  const user1Result = response.results.find((r) => r.username === 'user1')
  const user2Result = response.results.find((r) => r.username === 'user2')
  const user3Result = response.results.find((r) => r.username === 'user3')

  assertFalse(JSON.stringify(user1Result?.platforms) === JSON.stringify(user2Result?.platforms), 'User1 and user2 should have different availability')
  assertFalse(JSON.stringify(user2Result?.platforms) === JSON.stringify(user3Result?.platforms), 'User2 and user3 should have different availability')
})

test('Response structure: always includes responseTime', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)

  assertTrue('responseTime' in response, 'Response should have responseTime')
})

test('Response structure: no error on success', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: ['testuser'],
  }

  const response = await checkAvailability(request, false)

  assertFalse(!!response.error, 'Should not have error on success')
})

test('Response structure: error included on failure', async () => {
  const request: CheckAvailabilityRequest = {
    usernames: [],
  }

  const response = await checkAvailability(request, false)

  assertDefined(response.error, 'Should have error on failure')
  assertTrue(typeof response.error === 'string', 'Error should be a string')
})

export { results }
