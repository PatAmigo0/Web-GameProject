import { AbstractBaseScene } from '@abstracts/scene-base/AbstractBaseScene';
import { Character } from '@components/entities/Character';
import type { Map as SceneMap } from '@components/phaser/scene-components/GameMap';
import { ASSET_KEYS } from '@config/assets.config';
import { CAMERA_ZOOM } from '@config/render.config';
import type { BaseGameRoomState } from '@game/shared'; // Если есть доступ к типам
import { MapManager } from '@managers/MapManager';
import { GameService } from '@services/GameService';
import type { Room } from 'colyseus.js'; // Рекомендую добавить типы

export abstract class BaseGameScene extends AbstractBaseScene {
	protected map!: SceneMap;
	protected playersMap = new Map<string, Character>();

	protected activeRoom: Room<BaseGameRoomState> | null = null;

	public prepareAssets(): void {
		this.onPreload();
	}

	public setupScene(): void {
		const mapData = MapManager.createMap(this);
		this.map = mapData.map;

		const spawnPoint = mapData.playerSpawn;
		if (!spawnPoint) {
			throw 'Кто-то забыл добавить спавн на карту -_-';
		}

		this.cameras.main.setZoom(CAMERA_ZOOM);

		this.onCreate();

		MapManager.initMapPhysics(this, this.map, mapData.collidableLayers);
		this.initNetworkLogic();
	}

	public update(time: number, delta: number): void {
		this.playersMap.forEach((p) => p.update());
		this.heartbeat(time, delta);

		this.sendNetworkUpdates();
	}

	public closeScene(): void {
		const game = this.game as GameService;
		game.userInputService.removeLocalCharacer();
		game.colyseusService.leave();
		this.activeRoom = null;
		this.onShutdown();
	}

	//#region NETWORK LOGIC
	protected initNetworkLogic() {
		const game = this.game as GameService;
		this.activeRoom = game.colyseusService.activeRoom as Room<BaseGameRoomState>;

		if (!this.activeRoom) {
			console.error('Нет активной комнаты в ColyseusService!');
			return;
		}

		this.syncPlayers(this.activeRoom);

		this.activeRoom.onStateChange((_) => {
			if (this.activeRoom) this.syncPlayers(this.activeRoom);
		});
	}

	private syncPlayers(room: Room<BaseGameRoomState>) {
		const state = room.state;
		if (!state || !state.players) return;

		state.players.forEach((playerData: any, sessionId: string) => {
			if (!this.playersMap.has(sessionId)) {
				this.createPlayer(sessionId, playerData, room.sessionId);
			} else {
				this.updatePlayerNetwork(sessionId, playerData, room.sessionId);
			}
		});

		this.playersMap.forEach((_, sessionId) => {
			if (!state.players.has(sessionId)) {
				this.removePlayer(sessionId, room.sessionId);
			}
		});
	}

	private createPlayer(sessionId: string, data: any, mySessionId: string) {
		console.log('Создаю игрока:', sessionId);

		const character = new Character(this, data.x, data.y, ASSET_KEYS.CHARACTER_SPRITE, 0);

		character.init();

		const isLocal = sessionId === mySessionId;

		if (isLocal) {
			(this.game as GameService).userInputService.setLocalCharacter(character);
			this.cameras.main.startFollow(character);
		}

		this.playersMap.set(sessionId, character);
	}

	private sendNetworkUpdates() {
		if (!this.activeRoom) return;

		const mySessionId = this.activeRoom.sessionId;
		const localChar = this.playersMap.get(mySessionId);

		if (localChar) {
			this.activeRoom.send('move', { x: localChar.x, y: localChar.y });
		}
	}

	private updatePlayerNetwork(sessionId: string, data: any, mySessionId: string) {
		const character = this.playersMap.get(sessionId);
		if (!character) return;

		if (sessionId !== mySessionId) {
			const dist = Phaser.Math.Distance.Between(character.x, character.y, data.x, data.y);
			if (dist > 5) {
				character.x = Phaser.Math.Linear(character.x, data.x, 0.2);
				character.y = Phaser.Math.Linear(character.y, data.y, 0.2);
			}
		}
	}

	private removePlayer(sessionId: string, mySessionId: string) {
		console.log('Удаляю игрока:', sessionId);
		const char = this.playersMap.get(sessionId);
		if (char) {
			char.destroy();
			this.playersMap.delete(sessionId);
			if (sessionId === mySessionId) {
				(this.game as GameService).userInputService.removeLocalCharacer();
			}
		}
	}
	//#endregion
}
