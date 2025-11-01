import Phaser from 'phaser';
import { Players } from './services/PlayerService';
import { NetworkService } from './services/NetworkService';
import { EventService } from './services/EventService';
import { EventTypes } from './config/events.config';
import { STARTING_MENU } from './config/game.config';
import type { INamedSceneManager } from './core/interfaces/phaser.interfaces';
import { SceneKeys } from './types';
import { BootScene } from './scenes/system/BootScene';

export class GameService extends Phaser.Game {
	// REDECLARATION
	declare readonly scene: INamedSceneManager;

	// BASIC INITIALIZATION
	public Players = new Players();
	public NetworkService = new NetworkService();
	public EventService = new EventService();

	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.events.once(Phaser.Core.Events.READY, () => this.init());
		this.registry.set('NetworkService', this.NetworkService);
	}

	/* PRIVATE */

	// --- INITIALIZATION
	public init(): void {
		this._register_events();
		this._boot_();
	}

	private _register_events() {
		this.EventService.addListener(EventTypes.BOOT, () => {
			this.scene.stop(SceneKeys.BootScene);
			this.scene.start(STARTING_MENU);
		});
	}

	// --- SYS METHODS
	private async _boot_() {
		const BootScene = this.scene.getScene<BootScene>(SceneKeys.BootScene);
		if (!BootScene) console.warn('Не удалось загрузить boot сцену...');
		else {
			BootScene.loadAssets();
		}
	}
}
