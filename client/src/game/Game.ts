import Phaser from 'phaser';
import { Players } from './services/PlayerService';
import { NetworkService } from './services/NetworkService';
import { EventService } from './services/EventService';
import { EventTypes } from './config/events.config';
import { STARTING_MENU } from './config/game.config';
import type { INamedSceneManager } from './types/phaser.types';
import { SceneKeys } from './types';
import { BootScene } from './scenes/system/BootScene';

//#region GAME CLASS DEFINITION
export class GameService extends Phaser.Game {
	//#region PHASER OVERRIDES
	declare readonly scene: INamedSceneManager;
	//#endregion

	//#region CORE SERVICES
	public Players = new Players();
	public NetworkService = new NetworkService();
	public EventService = new EventService();
	//#endregion

	//#region GAME CONTEXT
	public online = false;
	public id!: string;
	//#endregion

	//#region CONSTRUCTOR
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.events.once(Phaser.Core.Events.READY, () => this._init());
		// Регистрация ключевых сервисов в реестре Phaser для доступа из сцен
		this.registry.set('NetworkService', this.NetworkService);
	}
	//#endregion

	//#region PUBLIC METHODS
	public setOnlineContext(id: string) {
		this.online = true;
		this.id = id;
	}
	//#endregion

	//#region PRIVATE INITIALIZATION
	private _init(): void {
		this._register_events();
		this._boot_();
	}

	private _register_events() {
		this.EventService.addListener(EventTypes.BOOT, () => {
			this.scene.stop(SceneKeys.BootScene);
			this.scene.start(STARTING_MENU);
		});
	}
	//#endregion

	//#region SYSTEM METHODS
	private async _boot_() {
		const BootScene = this.scene.getScene<BootScene>(SceneKeys.BootScene);
		if (!BootScene) console.warn('Не удалось загрузить boot сцену...');
		else {
			BootScene.loadAssets();
		}
	}
	//#endregion
}
//#endregion
