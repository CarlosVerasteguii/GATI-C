import { defineConfig } from '@playwright/test';

/**
 * Playwright config using Setup Project pattern.
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
            name: 'setup',
            testDir: './tests/setup',
            testMatch: 'auth.setup.ts',
            use: { channel: 'chromium' },
        },
        {
            name: 'authenticated',
            testDir: './tests/authenticated',
            dependencies: ['setup'],
            use: {
                channel: 'chromium',
                storageState: 'playwright/.auth/user.json',
            },
        },
        {
            name: 'guest',
            testDir: './tests/guest',
            use: { channel: 'chromium' },
        },
    ],
    webServer: {
        command: 'npm run dev:e2e',
        url: 'http://localhost:3000',
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
