import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    threads: false,
    testTimeout: 30000,
    coverage: {
      reporter: ["json"],
    },
  },
})
