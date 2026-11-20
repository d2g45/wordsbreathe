import { defineConfig } from "@playwright/test";

// The ddev project URL: `name` in .ddev/config.yaml, and PRIMARY_SITE_URL in .env.
// A constant because reading .env needs process.env, and tsc has no Node types.
const SITE_URL = "https://wordsbreathe.ddev.site";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: SITE_URL,
    // The Mac's installed Chrome, so `npx playwright install` is never needed.
    channel: "chrome",
    // ddev's certificate may not be trusted by the test browser.
    ignoreHTTPSErrors: true,
  },
  // Starts the dev server if it isn't running. Vite stays up in the container
  // after the run.
  webServer: {
    command: "ddev npm run dev",
    url: `${SITE_URL}:3000/@vite/client`,
    ignoreHTTPSErrors: true,
    reuseExistingServer: true,
  },
});
