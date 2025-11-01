import type { NamedScene } from '../abstracts/NamedScene';

export interface INamedSceneManager extends Phaser.Scenes.SceneManager {
	scenes: NamedScene[];
	getScene<T extends NamedScene>(key: string): T;
	run(key: string, data?: object): this;
	start(key: string, data?: object): this;
}
