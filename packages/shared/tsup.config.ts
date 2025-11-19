import { config as dotenvConfig } from 'dotenv';
import { defineConfig } from 'tsup';

dotenvConfig();

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: true,
	clean: true,
	env: {
		API_URL: process.env.API_URL || '',
		MY_SHARED_SECRET: process.env.MY_SHARED_SECRET || '',
	},
});
