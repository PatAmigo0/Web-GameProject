import Phaser from 'phaser';
import { Players } from '@services/PlayerService';
import { NetworkService } from '@services/NetworkService';
import { EventTypes } from '@config/events.config';
import { STARTING_MENU } from '@config/game.config';
import type { ITypedSceneManager } from '@gametypes/phaser.types';
import { SceneKeys } from '@gametypes/scene.types';
import { BootScene } from '@scenes/system/BootScene';
import type { WithPhaserLifecycle } from '@abstracts/scenes/WithPhaserLifecycle';

//#region GAME CLASS DEFINITION
export class GameService extends Phaser.Game {
	//#region PHASER OVERRIDES
	declare readonly scene: ITypedSceneManager;
	//#endregion

	//#region CORE SERVICES
	public Players = new Players();
	public NetworkService = new NetworkService();

	//#endregion

	//#region GAME CONTEXT
	public online = false;
	public id!: string;

	public currentMainScene: WithPhaserLifecycle = null;
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

	//#region PRIVATE MAIN METHODS
	private _changeMainScene(sceneKey: string) {
		console.debug(
			`[game] меняю главную сцену: ${this.currentMainScene.sceneKey} -> ${sceneKey}`,
		);
		if (this.currentMainScene != null) {
			this.scene.stop(this.currentMainScene.sceneKey);
			this.currentMainScene.shutdown();
		}

		const newScene = this.scene.getScene<WithPhaserLifecycle>(sceneKey);
		this.scene.start(sceneKey);
		this.currentMainScene = newScene;
	}
	//#endregion

	//#region PRIVATE INITIALIZATION
	private _init(): void {
		this._register_events();
		this.__boot__();
	}

	private _register_events() {
		this.events.addListener(EventTypes.BOOT, () => {
			this.events.emit(EventTypes.MAIN_SCENE_CHANGE, STARTING_MENU);
		});

		this.events.addListener(
			EventTypes.MAIN_SCENE_CHANGE,
			(sceneKey: string) => {
				this._changeMainScene(sceneKey);
			},
		);
	}
	//#endregion

	//#region SYSTEM METHODS
	/**
	 * Отправная точка всей игры
	 */
	private __boot__() {
		const BootScene = this.scene.getScene<BootScene>(SceneKeys.BootScene);
		if (BootScene) {
			this.currentMainScene = BootScene;
			BootScene.loadAssets();
		} else console.error('[game] не удалось загрузить boot сцену');
	}
	//#endregion
}
//#endregion
