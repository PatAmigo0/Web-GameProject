import { copy } from 'esbuild-plugin-copy';
import { defineConfig, Options } from 'tsup';
import packageJson from './package.json';

export default defineConfig((options: Options) => ({
	format: 'esm',
	platform: 'node',
	target: 'node22',
	splitting: false,

	external: [...Object.keys(packageJson.dependencies || {}), 'ws', 'bufferutil', 'utf-8-validate'],
	noExternal: ['@game/shared'],

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
