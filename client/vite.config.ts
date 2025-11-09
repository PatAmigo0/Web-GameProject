import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
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
	server: { port: 142 },
});
