import { BaseService } from '@abstracts/service/BaseService';
import { StandaloneService } from '@abstracts/service/StandaloneService';
import { SceneKeys } from '@gametypes/scene.types';
import { SceneManager } from '@managers/SceneManager';
import { BootScene } from '@scenes/system/BootScene';
import { EventService } from '@services/EventService';
import { NetworkService } from '@services/NetworkService';
import { PlayerService } from '@services/PlayerService';
import Phaser from 'phaser';
import { UserInputService } from './UserInputService';

//#region GAME CLASS DEFINITION
export class GameService extends Phaser.Game {
	//#region PHASER OVERRIDES
	declare readonly scene: SceneManager;
	//#endregion

	//#region CORE SERVICES
	public playerService = new PlayerService(this);
	private networkService = new NetworkService(this);
	private eventService = new EventService(this);
	private userInputService = new UserInputService(this.input.keyboard);
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
		this.initAttributes();
		this.__boot__();
	}

	private initAttributes() {
		this.setNewPrototypes();
		this.initServices();
	}

	private setNewPrototypes() {
		// обновляю this.scene чтобы он поддерживал новый функционал из SceneManager (кастомный)
		(
			Object.setPrototypeOf(
				this.scene,
				SceneManager.prototype,
			) as SceneManager
		).init();
	}

	private initServices() {
		// инициализируем все сервисы автоматически
		Object.values(this).forEach((propertyValue) => {
			if (
				propertyValue &&
				(propertyValue instanceof BaseService ||
					propertyValue instanceof StandaloneService)
			) {
				console.debug('Calling init on:', propertyValue);
				(propertyValue as unknown as { init: () => void }).init();
			}
		});
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
		} else throw 'Ошибка [game]: Не удалось загрузить boot сцену';
	}
	//#endregion
}
//#endregion
