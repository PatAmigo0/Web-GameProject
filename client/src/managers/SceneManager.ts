import type { TypedScene } from '@abstracts/scenes/TypedScene';
import type { WithPhaserLifecycle } from '@abstracts/scenes/WithPhaserLifecycle';
import type { ITypedSceneManager } from '@gametypes/phaser.types';

export class SceneManager
	extends Phaser.Scenes.SceneManager
	implements ITypedSceneManager
{
	declare scenes: TypedScene[];
	private _currentMainScene!: WithPhaserLifecycle;

	public init() {
		this.currentMainScene = null;
	}

	public changeMainScene(sceneKey: string) {
		console.debug(
			`[game] меняю главную сцену: ${this.currentMainScene.sceneKey} -> ${sceneKey}`,
		);
		if (this.currentMainScene != null) {
			this.stop(this.currentMainScene.sceneKey);
			this.currentMainScene.shutdown();
		}

		const newScene = this.getScene<WithPhaserLifecycle>(sceneKey);
		this.start(sceneKey);
		this.currentMainScene = newScene;
	}

	set currentMainScene(scene: WithPhaserLifecycle) {
		this._currentMainScene = scene;
	}

	get currentMainScene() {
		return this._currentMainScene;
	}
}
