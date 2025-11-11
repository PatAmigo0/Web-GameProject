import type { CoreScene } from '@abstracts/scene-base/CoreScene';

export interface ICoreSceneManager extends Phaser.Scenes.SceneManager {
	scenes: CoreScene[];
	getScene<T extends CoreScene>(key: string): T;
	run(key: string, data?: object): this;
	start(key: string, data?: object): this;
}

export const PhaserEvents = {
	SHUTDOWN: 'shutdown',
} as const;
