import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { contactApiMiddleware, cpStatsMiddleware } from './server/dev-middleware.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Loads every variable from .env files (not only VITE_-prefixed ones) for
  // the dev/preview API middleware. These values stay on the Node side:
  // Vite only exposes VITE_-prefixed variables to client code.
  const serverEnv = { ...loadEnv(mode, process.cwd(), ''), ...process.env }

  return {
    plugins: [
      react(),
      {
        name: 'portfolio-api',
        configureServer(server) {
          server.middlewares.use('/api/contact', contactApiMiddleware(serverEnv))
          server.middlewares.use('/api/cp-stats', cpStatsMiddleware())
        },
        configurePreviewServer(server) {
          server.middlewares.use('/api/contact', contactApiMiddleware(serverEnv))
          server.middlewares.use('/api/cp-stats', cpStatsMiddleware())
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          // Long-lived vendor code in its own chunk: smaller app chunk, better caching between deploys.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler|recoil)[\\/]/.test(id)) return 'react-vendor'
            if (/[\\/]node_modules[\\/]gsap[\\/]/.test(id)) return 'gsap'
            return undefined
          },
        },
      },
    },
  }
})
