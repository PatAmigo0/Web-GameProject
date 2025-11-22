import { VITE_PORT } from '@game/shared';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		define: {
			__LOGGER_ENABLED__: mode === 'development',
			__PRODUCTION__: mode === 'production',

			// 'process.env.VITE_SERVER_HOST': JSON.stringify(env.VITE_SERVER_HOST),
		},
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					pure_funcs: ['Logger.prototype.debug', 'Logger.prototype.log', 'Logger.prototype.warn'],
					passes: 2,
					unsafe: true,
					unsafe_arrows: false,
					ecma: 2020,
					drop_console: false,
				},
				module: true,
				format: {
					comments: false,
					ecma: 2020,
				},
			},
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('phaser')) {
							return 'phaser';
						}
					},
				},
			},
		},
		resolve: {
			alias: {
				'@main': path.resolve(__dirname, './src/main.ts'),
				'@decorators': path.resolve(__dirname, './src/utils/decorators'),
				'@abstracts': path.resolve(__dirname, './src/core/abstracts'),
				'@managers': path.resolve(__dirname, './src/managers'),
				'@components': path.resolve(__dirname, './src/components'),
				'@scenes': path.resolve(__dirname, './src/scenes'),
				'@services': path.resolve(__dirname, './src/services'),
				'@config': path.resolve(__dirname, './src/config'),
				'@utils': path.resolve(__dirname, './src/utils'),
				'@gametypes': path.resolve(__dirname, './src/types'),
				'@core': path.resolve(__dirname, './src/core'),
				'@styles': path.resolve(__dirname, './src/styles'),
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			port: VITE_PORT,
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
				},
			},
		} as any,
	};
});
