import 'phaser';

declare module 'phaser' {
	namespace Scenes {
		// --- ScenePlugin ---
		interface ScenePlugin {
			get<
				T extends import('../core/abstracts/scenes/TypedScene').NamedScene,
			>(
				key: string,
			): T;

			run<
				T extends import('../core/abstracts/scenes/TypedScene').NamedScene,
			>(
				key: string,
				data?: object,
			): T;

			start(key: string, data?: object): void;
		}

		// --- SceneManager ---
		interface SceneManager {
			scenes: import('../core/abstracts/scenes/TypedScene').NamedScene[];

			getScene<
				T extends import('../core/abstracts/scenes/TypedScene').NamedScene,
			>(
				key: string,
			): T;
		}
	}
}
