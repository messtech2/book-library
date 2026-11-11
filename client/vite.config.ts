import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // Keep Vitest's default excludes (node_modules, dist, ...) and skip Playwright specs
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
