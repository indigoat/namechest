import { checkAvailability } from '../mockAvailability'
import type { CheckAvailabilityRequest } from '../../models/types'

export const fixtures = {
  singleUsername: {
    input: { usernames: ['johndoe'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['johndoe'] } as CheckAvailabilityRequest,
        false,
      )
      if (response.results.length !== 1) {
        throw new Error('Expected 1 result')
      }
      if (response.results[0]?.username !== 'johndoe') {
        throw new Error('Username mismatch')
      }
      if (!response.results[0]?.platforms) {
        throw new Error('Missing platforms')
      }
      if (!response.results[0]?.domains) {
        throw new Error('Missing domains')
      }
      return true
    },
  },

  multipleUsernames: {
    input: { usernames: ['alice', 'bob', 'charlie'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['alice', 'bob', 'charlie'] } as CheckAvailabilityRequest,
        false,
      )
      if (response.results.length !== 3) {
        throw new Error('Expected 3 results')
      }
      return true
    },
  },

  duplicateUsernames: {
    input: { usernames: ['john', 'john', 'jane'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['john', 'john', 'jane'] } as CheckAvailabilityRequest,
        false,
      )
      if (response.results.length !== 2) {
        throw new Error('Expected 2 results after deduplication')
      }
      return true
    },
  },

  caseInsensitive: {
    input: { usernames: ['John', 'JOHN', 'john'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['John', 'JOHN', 'john'] } as CheckAvailabilityRequest,
        false,
      )
      if (response.results.length !== 1) {
        throw new Error('Expected 1 result after case-insensitive deduplication')
      }
      if (response.results[0]?.username !== 'john') {
        throw new Error('Username should be lowercase')
      }
      return true
    },
  },

  emptyArray: {
    input: { usernames: [] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: [] } as CheckAvailabilityRequest,
        false,
      )
      if (!response.error) {
        throw new Error('Expected error for empty array')
      }
      if (response.results.length !== 0) {
        throw new Error('Expected 0 results for empty array')
      }
      return true
    },
  },

  reservedNames: {
    input: { usernames: ['twitter', 'instagram', 'github'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['twitter', 'instagram', 'github'] } as CheckAvailabilityRequest,
        false,
      )
      if (response.results.length !== 3) {
        throw new Error('Expected 3 results')
      }

      const twitter = response.results.find((r) => r.username === 'twitter')
      if (twitter?.platforms.twitter !== false) {
        throw new Error('Twitter reserved name should be unavailable on Twitter')
      }

      const instagram = response.results.find((r) => r.username === 'instagram')
      if (instagram?.platforms.instagram !== false) {
        throw new Error('Instagram reserved name should be unavailable on Instagram')
      }

      const github = response.results.find((r) => r.username === 'github')
      if (github?.platforms.github !== false) {
        throw new Error('GitHub reserved name should be unavailable on GitHub')
      }

      return true
    },
  },

  shortUsername: {
    input: { usernames: ['a'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['a'] } as CheckAvailabilityRequest,
        false,
      )
      const result = response.results[0]
      if (!result) {
        throw new Error('Expected result')
      }

      Object.values(result.domains).forEach((available) => {
        if (available !== false) {
          throw new Error('Single-character domains should be unavailable')
        }
      })

      return true
    },
  },

  deterministic: {
    input: { usernames: ['testuser'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response1 = await checkAvailability(
        { usernames: ['testuser'] } as CheckAvailabilityRequest,
        false,
      )
      const response2 = await checkAvailability(
        { usernames: ['testuser'] } as CheckAvailabilityRequest,
        false,
      )

      if (JSON.stringify(response1.results[0]?.platforms) !== JSON.stringify(response2.results[0]?.platforms)) {
        throw new Error('Results should be deterministic')
      }

      return true
    },
  },

  latencySimulation: {
    input: { usernames: ['testuser'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['testuser'] } as CheckAvailabilityRequest,
        true,
      )

      if (response.responseTime < 30) {
        throw new Error('Response time should include simulated latency')
      }

      return true
    },
  },

  responseStructure: {
    input: { usernames: ['testuser'] } as CheckAvailabilityRequest,
    validate: async () => {
      const response = await checkAvailability(
        { usernames: ['testuser'] } as CheckAvailabilityRequest,
        false,
      )

      if (!('responseTime' in response)) {
        throw new Error('Response should include responseTime')
      }

      if (response.results.length !== 1) {
        throw new Error('Response should include results')
      }

      const result = response.results[0]
      if (!result?.checkedAt) {
        throw new Error('Result should include checkedAt timestamp')
      }

      if (typeof new Date(result.checkedAt).getTime() !== 'number' || new Date(result.checkedAt).getTime() === 0) {
        throw new Error('checkedAt should be a valid ISO date')
      }

      return true
    },
  },
}
