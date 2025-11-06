import type { TypedScene } from '@abstracts/scene/TypedScene';
import type { WithPhaserLifecycle } from '@abstracts/scene/WithPhaserLifecycle';
import type { IInitializiable } from '@gametypes/interface.types';
import type { ITypedSceneManager } from '@gametypes/phaser.types';

export class SceneManager
	extends Phaser.Scenes.SceneManager
	implements ITypedSceneManager, IInitializiable
{
	declare scenes: TypedScene[];
	private _currentMainScene: WithPhaserLifecycle | undefined;

	public init() {
		this.currentMainScene = null;
	}

	public changeMainScene(sceneKey: string) {
		console.debug(
			`[SceneManager] меняю главную сцену: ${this.currentMainScene.sceneKey} -> ${sceneKey}`,
		);

		if (this._currentMainScene) {
			this.stop(this.currentMainScene.sceneKey);
			this._currentMainScene.shutdown();
		}

		const newScene = this.getScene<WithPhaserLifecycle>(sceneKey);
		this.start(sceneKey);
		this._currentMainScene = newScene;
	}

	//#region SETTERS
	set currentMainScene(scene: WithPhaserLifecycle) {
		if (!this._currentMainScene) this._currentMainScene = scene;
		else {
			throw 'Нельзя изменять currentMainScene без вызова события, если он не равен null';
		}
	}

	//#endregion

	//#region GETTERS
	get currentMainScene() {
		return this._currentMainScene;
	}
	//#endregion
}
