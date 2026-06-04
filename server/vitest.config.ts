import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["src/tests/setup.ts"],
    fileParallelism: false, // Run tests sequentially
    include: ["src/tests/**/*.test.ts"],
    testTimeout: 30000, // 30 seconds timeout
  },
});
