import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@scenes': path.resolve(__dirname, './src/scenes'),
			'@services': path.resolve(__dirname, './src/services'),
			'@config': path.resolve(__dirname, './src/config'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@gametypes': path.resolve(__dirname, './src/types'),
			'@core': path.resolve(__dirname, './src/core'),
			'@styles': path.resolve(__dirname, './src/styles'),

			// single aliases
			'@main': path.resolve(__dirname, './src/main.ts'),
		},
	},
});
