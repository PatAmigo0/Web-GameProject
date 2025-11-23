import { BaseService } from '@abstracts/service-base/BaseService';
import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { IInitializiable } from '@gametypes/core.types';
import { SceneKeys } from '@gametypes/scene.types';
import { AssetManager } from '@managers/AssetManager';
import { SceneManager } from '@managers/SceneManager';
import { StyleManager } from '@managers/StyleManager';
import { TransitionManager } from '@managers/TransitionManager';
import { BootScene } from '@scenes/system-scenes/BootScene';
import { EventService } from '@services/EventService';
import { NetworkService } from '@services/NetworkService';
import { PlayerService } from '@services/PlayerService';
import { SceneDisposalService } from '@services/SceneDisposalService';
import { UserInputService } from '@services/UserInputService';
import type { Logger } from '@utils/Logger.util';
import Phaser from 'phaser';
import { AuthService } from './AuthService';

//#region GAME CLASS DEFINITION
@injectLogger()
@injectInitializator((service: GameService) => {
	service.initAttributes();
	service.__boot__();
})
export class GameService extends Phaser.Game {
	private declare logger: Logger;

	//#region PHASER OVERRIDES
	declare readonly scene: SceneManager;
	//#endregion

	//#region MANAGERS
	public assetManager!: AssetManager;
	private transitionManager!: TransitionManager;
	private styleManager!: StyleManager;
	//#endregion

	//#region CORE SERVICES
	public playerService!: PlayerService;
	public userInputService!: UserInputService;
	public networkService!: NetworkService;
	public authService!: AuthService;
	private eventService!: EventService;
	public sceneDisposalService!: SceneDisposalService;
	//#endregion

	//#region CONSTRUCTOR
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.events.once(Phaser.Core.Events.READY, () => this.init());
	}
	//#endregion

	//#region PRIVATE INITIALIZATION
	private declare init: () => void;

	private initAttributes() {
		this.setNewPrototypes();

		this.createServices();
		this.initServices();

		this.createManagers();
		this.initManagers();

		this.networkService;
		this.eventService;
	}

	private setNewPrototypes() {
		// обновляю this.scene чтобы он поддерживал новый функционал из SceneManager (кастомный)
		Object.setPrototypeOf(this.scene, SceneManager.prototype);
	}

	private createServices() {
		this.playerService = new PlayerService(this);
		this.userInputService = new UserInputService(this.input.keyboard, this.events);
		this.networkService = new NetworkService(this, this.events, this.scene);
		this.eventService = new EventService(this.events, this.domContainer);
		this.sceneDisposalService = new SceneDisposalService(this.scene);
		this.authService = new AuthService(this.networkService, this.events);
	}

	private initServices() {
		// инициализируем все сервисы автоматически
		Object.values(this).forEach((propertyValue) => {
			if (this.isService(propertyValue)) {
				this.logger.debug('calling init on:', propertyValue);
				propertyValue.init();
			}
		});
	}

	private createManagers() {
		this.styleManager = new StyleManager();
		this.transitionManager = new TransitionManager(this.scene);
		this.assetManager = new AssetManager(this, this.styleManager);
	}

	private initManagers() {
		this.scene.init(this.transitionManager, this.sceneDisposalService);
	}

	private isService(propertyValue: any): propertyValue is IInitializiable {
		return (
			propertyValue &&
			(propertyValue instanceof BaseService || propertyValue instanceof StandaloneService)
		);
	}
	//#endregion

	//#region SYSTEM METHODS
	/**
	 * Отправная точка всей игры
	 */
	private __boot__() {
		const BootScene = this.scene.getScene<BootScene>(SceneKeys.BootScene);
		BootScene.shutdown();
		if (BootScene) {
			this.scene.changeMainScene(BootScene.sceneKey);
			BootScene.loadAssets().then(() => BootScene.handleStartup());
		} else this.logger.error('Не удалось загрузить boot сцену');
	}
	//#endregion
}
//#endregion
