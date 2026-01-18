// Minimal fallback config without importing vitest to avoid missing module errors
export default {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["**/*.test.{ts,tsx}"],
  },
};
