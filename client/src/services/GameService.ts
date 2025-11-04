import { SceneKeys } from '@gametypes/scene.types';
import { SceneManager } from '@managers/SceneManager';
import { BootScene } from '@scenes/system/BootScene';
import { EventService } from '@services/EventService';
import { NetworkService } from '@services/NetworkService';
import { PlayerService } from '@services/PlayerService';
import Phaser from 'phaser';

//#region GAME CLASS DEFINITION
export class GameService extends Phaser.Game {
	//#region PHASER OVERRIDES
	declare readonly scene: SceneManager;
	//#endregion

	//#region CORE SERVICES
	public playerService = new PlayerService(this);
	private networkService = new NetworkService();
	private eventService = new EventService(this);
	//#endregion

	//#region GAME CONTEXT
	//#endregion

	//#region CONSTRUCTOR
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.events.once(Phaser.Core.Events.READY, () => this.init());
	}
	//#endregion

	//#region PUBLIC METHODS

	//#endregion

	//#region PRIVATE MAIN METHODS
	//#endregion

	//#region PRIVATE INITIALIZATION
	private init(): void {
		this.networkService; // D
		this.initAttributes();
		this.eventService.init();
		this.__boot__();
	}

	private initAttributes() {
		// обновляю this.scene чтобы он поддерживал новый функционал из SceneManager (кастомный)
		(
			Object.setPrototypeOf(
				this.scene,
				SceneManager.prototype,
			) as SceneManager
		).init();
	}
	//#endregion

	//#region SYSTEM METHODS
	/**
	 * Отправная точка всей игры
	 */
	private __boot__() {
		const BootScene = this.scene.getScene<BootScene>(SceneKeys.BootScene);
		if (BootScene) {
			this.scene.currentMainScene = BootScene;
			BootScene.loadAssets();
		} else console.error('[game] не удалось загрузить boot сцену');
	}
	//#endregion
}
//#endregion
