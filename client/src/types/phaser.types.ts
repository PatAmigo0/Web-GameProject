import type { TypedScene } from '@abstracts/scenes/TypedScene';

export interface ITypedSceneManager extends Phaser.Scenes.SceneManager {
	scenes: TypedScene[];
	getScene<T extends TypedScene>(key: string): T;
	run(key: string, data?: object): this;
	start(key: string, data?: object): this;
}
