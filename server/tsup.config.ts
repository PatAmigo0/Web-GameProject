import { defineConfig } from 'tsup';

export default defineConfig({
	format: 'esm',

	platform: 'node',
	target: 'node22',
	splitting: false,

	external: [
		'@colyseus/tools',
		'@colyseus/monitor',
		'@colyseus/playground',
		'colyseus',
		'cors',
		'express',
		'dotenv',
		'debug',
		'nanoid',
		'bcrypt',
		'mongoose',
		'@prisma/client',
	],

	entry: ['src/app.ts'],

	bundle: true,
	treeshake: true,
	sourcemap: true,
	// minifyWhitespace: true,
	// minifyIdentifiers: false,
	// minifySyntax: true,
	minify: true,
});
