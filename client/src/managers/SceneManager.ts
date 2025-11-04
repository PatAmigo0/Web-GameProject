import type { TypedScene } from '@abstracts/scenes/TypedScene';
import type { WithPhaserLifecycle } from '@abstracts/scenes/WithPhaserLifecycle';
import type { IInitializiable } from '@gametypes/interface.types';
import type { ITypedSceneManager } from '@gametypes/phaser.types';

export class SceneManager
	extends Phaser.Scenes.SceneManager
	implements ITypedSceneManager, IInitializiable
{
	declare scenes: TypedScene[];
	private _currentMainScene!: WithPhaserLifecycle;

	public init() {
		this.currentMainScene = null;
	}

	public changeMainScene(sceneKey: string) {
		console.debug(
			`[SceneManager] меняю главную сцену: ${this.currentMainScene.sceneKey} -> ${sceneKey}`,
		);
		if (this.currentMainScene != null) {
			this.stop(this.currentMainScene.sceneKey);
			this.currentMainScene.shutdown();
		}

		const newScene = this.getScene<WithPhaserLifecycle>(sceneKey);
		this.start(sceneKey);
		this.currentMainScene = newScene;
	}

	//#region SETTERS
	set currentMainScene(scene: WithPhaserLifecycle) {
		if (this._currentMainScene == null) this._currentMainScene = scene;
		else
			console.error(
				'Нельзя изменять currentMainScene без вызова события, если он не равен null',
			);
	}

	//#endregion

	//#region GETTERS
	get currentMainScene() {
		return this._currentMainScene;
	}
	//#endregion
}
