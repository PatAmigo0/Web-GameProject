// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const baseURL = `http://${process.env.VITE_SERVER_HOST || 'localhost:2567'}`;

console.log(`Using base URL for tests: ${baseURL}`);

export default defineConfig({
	testDir: './__tests__',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',

	use: {
		baseURL: baseURL, // для запросов /api/...
		trace: 'on-first-retry',
	},

	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
	],
});
