import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.global.setup.ts',
    coverage: {
      all: true,
      provider: 'v8',
      include: ["src"],
      reporter: 'clover',
    },
  },
})