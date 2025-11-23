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
import { AuthService } from '@services/AuthService';
import { EventService } from '@services/EventService';
import { NetworkService } from '@services/NetworkService';
import { NotificationService } from '@services/NotificationService';
import { PlayerService } from '@services/PlayerService';
import { SceneDisposalService } from '@services/SceneDisposalService';
import { UserInputService } from '@services/UserInputService';
import { ValidatorService } from '@services/ValidatorService';
import type { Logger } from '@utils/Logger.util';
import Phaser from 'phaser';

//#region GAME CLASS DEFINITION
@injectLogger()
@injectInitializator(async (service: GameService) => {
	await service.initAttributes();
	service.__boot__();
})
export class GameService extends Phaser.Game {
	private declare logger: Logger;

	//#region PHASER OVERRIDES
	declare readonly scene: SceneManager;
	//#endregion

	//#region MANAGERS
	public assetManager!: AssetManager;
	public transitionManager!: TransitionManager;
	private styleManager!: StyleManager;
	//#endregion

	//#region CORE SERVICES
	public playerService!: PlayerService;
	public userInputService!: UserInputService;
	public networkService!: NetworkService;
	public authService!: AuthService;
	public validatorService!: ValidatorService;
	public eventService!: EventService;
	public sceneDisposalService!: SceneDisposalService;
	public notificationService!: NotificationService;
	//#endregion

	//#region CONSTRUCTOR
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.events.once(Phaser.Core.Events.READY, () => this.init());
	}
	//#endregion

	//#region PRIVATE INITIALIZATION
	private declare init: () => Promise<void>;

	private async initAttributes() {
		this.setNewPrototypes();

		this.createServices();
		await this.initServices();

		this.createManagers();
		await this.initManagers();
	}

	private setNewPrototypes() {
		// обновляю this.scene чтобы он поддерживал новый функционал из SceneManager (кастомный)
		Object.setPrototypeOf(this.scene, SceneManager.prototype);
	}

	private createServices() {
		// все сервисы создаются здесь, с прокидыванием зависимостей

		this.playerService = new PlayerService();
		this.validatorService = new ValidatorService();
		this.userInputService = new UserInputService(this.input.keyboard, this.events);
		this.notificationService = new NotificationService(this.scene, this.events);
		this.networkService = new NetworkService(this.events, this.scene, this.notificationService);
		this.eventService = new EventService(this.events, this.domContainer);
		this.sceneDisposalService = new SceneDisposalService(this.scene);
		this.authService = new AuthService(this.networkService, this.events);
	}

	private async initServices() {
		// инициализируем все сервисы автоматически
		const promises: Promise<any>[] = [];

		Object.values(this).forEach((propertyValue) => {
			if (this.isService(propertyValue)) {
				this.logger.debug('calling init on:', propertyValue);
				promises.push(propertyValue.init());
			}
		});

		await Promise.all(promises);
		this.logger.debug('Закончил загрузку сервисов');
	}

	private createManagers() {
		this.styleManager = new StyleManager();
		this.transitionManager = new TransitionManager(this.scene);
		this.assetManager = new AssetManager(this, this.styleManager);
	}

	private async initManagers() {
		await this.scene.init(this.transitionManager, this.sceneDisposalService, this.notificationService);
		await this.assetManager.init();
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
			BootScene.loadAssets().then(() => {
				this.scene.start(SceneKeys.Notifications);
				BootScene.handleStartup();
			});
		} else this.logger.error('Не удалось загрузить boot сцену');
	}
	//#endregion
}
//#endregion
