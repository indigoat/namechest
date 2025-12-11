import { useMutation } from '@tanstack/react-query'

import type { CheckAvailabilityRequest, CheckAvailabilityResponse } from '../models/types'

async function checkAvailability(usernames: string[]): Promise<CheckAvailabilityResponse> {
  const response = await fetch('/api/check-availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usernames } as CheckAvailabilityRequest),
  })

  if (!response.ok) {
    throw new Error('Failed to check availability')
  }

  return response.json()
}

export function useAvailabilityCheck() {
  return useMutation({
    mutationFn: checkAvailability,
  })
}
