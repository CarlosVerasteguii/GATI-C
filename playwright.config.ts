import { defineConfig } from '@playwright/test';

/**
 * Minimal Playwright config for GATI-C refactor safety net
 */
export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://localhost:3000',
        actionTimeout: 10 * 1000, // 10 seconds for actions
        navigationTimeout: 30 * 1000, // 30 seconds for navigation
        trace: 'on-first-retry', // Record trace for retried tests
    },
    timeout: 60 * 1000, // Default timeout for each test is 1 minute
    projects: [
        {
            name: 'chromium',
            use: { channel: 'chromium' },
        },
    ],
    webServer: {
        command: 'npm run dev:e2e',
        url: 'http://localhost:3000', // The URL that Playwright will expect
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
