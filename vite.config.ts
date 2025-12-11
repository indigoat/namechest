import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { apiMiddleware } from './app/server/api-middleware'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-routes',
      configureServer(server) {
        server.middlewares.use(apiMiddleware())
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
  },
})
