// prisma.config.js
import 'dotenv/config';
import { type PrismaConfig, env } from 'prisma/config';

export default {
	schema: 'prisma/schema.prisma',

	migrations: {
		path: 'prisma/migrations',
		seed: 'tsx prisma/seed.ts',
	},

	datasource: {
		url: env('DATABASE_URL'),
	},
} satisfies PrismaConfig;
