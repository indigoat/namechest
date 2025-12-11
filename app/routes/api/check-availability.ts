import type { CheckAvailabilityRequest, CheckAvailabilityResponse } from '../../models/types'
import { checkAvailability } from '../../services/mockAvailability'

export async function handleAvailabilityCheck(
  request: CheckAvailabilityRequest,
  simulateLatency: boolean = true,
): Promise<CheckAvailabilityResponse> {
  return checkAvailability(request, simulateLatency)
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json()

    const result = await checkAvailability(body as CheckAvailabilityRequest, true)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    const response: CheckAvailabilityResponse = {
      results: [],
      error: 'Invalid request body',
      responseTime: 0,
    }

    return new Response(JSON.stringify(response), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
