import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1,
  timeout: 60_000, expect: { timeout: 10_000 },
  reporter: "list", use: { baseURL: "http://localhost:3345", trace: "retain-on-failure" },
  projects: [
    { name: "chromium-mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium", launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } } },
    { name: "webkit-mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "webkit" } },
  ],
  webServer: { command: "npx tsx tests/browser-server.ts", url: "http://localhost:3345/registreer", timeout: 120_000, reuseExistingServer: false },
});
