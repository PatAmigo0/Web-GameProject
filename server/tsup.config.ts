import { copy } from 'esbuild-plugin-copy';
import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
	format: 'esm',

	platform: 'node',
	target: 'node22',
	splitting: false,

	external: [
		'@colyseus/tools',
		'@colyseus/monitor',
		'@colyseus/playground',
		'@colyseus/core',
		'cors',
		'express',
		'dotenv',
		'debug',
		'nanoid',
		'bcrypt',
		'mongoose',
		'@prisma/client',
		'@colyseus/ws-transport',
	],
	// noExternal: ['nanoid'],

	entry: ['src/app.ts'],
	outDir: 'dist',

	bundle: true,
	treeshake: true,
	sourcemap: !options.watch,
	// minifyWhitespace: true,
	// minifyIdentifiers: false,
	// minifySyntax: true,
	minify: !options.watch,

	esbuildPlugins: [
		copy({
			resolveFrom: 'cwd',
			assets: {
				from: ['./prisma/schema.prisma'],
				to: ['./dist/prisma'],
			},
		}),
	],

	clean: !options.watch,
}));
