import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend serves the built output from the Python package (`vyralis/gui`),
// so the build is emitted there directly and the dev server proxies /api and /ws.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../vyralis/gui',
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.VYRALIS_API ?? 'http://127.0.0.1:8756',
        changeOrigin: true,
      },
      '/ws': {
        target: (process.env.VYRALIS_API ?? 'http://127.0.0.1:8756').replace('http', 'ws'),
        ws: true,
      },
    },
  },
})
