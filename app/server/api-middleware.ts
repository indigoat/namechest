import type { IncomingMessage, ServerResponse } from 'node:http'

import type { Connect } from 'vite'

import { POST } from '../routes/api/check-availability'

export function apiMiddleware(): Connect.NextHandleFunction {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ) => {
    if (req.url === '/api/check-availability' && req.method === 'POST') {
      try {
        let body = ''
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString()
        })

        req.on('end', async () => {
          const request = new Request('http://localhost/api/check-availability', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          })

          const response = await POST(request)
          const responseBody = await response.text()

          res.writeHead(response.status, {
            'Content-Type': 'application/json',
          })
          res.end(responseBody)
        })
      } catch (error) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        })
        res.end(JSON.stringify({ error: 'Internal server error' }))
      }
    } else {
      next()
    }
  }
}
