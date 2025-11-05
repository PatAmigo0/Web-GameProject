//#region IMPORTS
import { BaseService } from '@abstracts/service/BaseService';
import { Player } from '@components/entities/Player';
import type { IInitializiable } from '@gametypes/interface.types';
import { PlayerManager } from '@managers/PlayerManager';
//#endregion

//#region CLASS DEFINITION
export class PlayerService extends BaseService implements IInitializiable {
	//#region CLASS ATTRIBUTES
	private players = new Map<string, Player>();
	private localPlayer!: Player; // локальный игрок, т.е игрок браузера
	private playerManager!: PlayerManager;
	//#endregion

	//#region
	public init() {
		this.playerManager = new PlayerManager(this.game);
		this.localPlayer = new Player();
		this.localPlayer;
		this.playerManager;
	}
	//#endregion

	//#region PUBLIC METHODS
	/**
	 * Возвращает игрока по его уникальному ID
	 * @param playerID ID игрока для поиска
	 * @returns Объект Player или undefined, если игрок не найден
	 */
	public getPlayerByUserID(userID: string): Player | undefined {
		return this.players.get(userID);
	}
	//#endregion

	//#region PRIVATE METHODS

	//#endregion

	// TODO: добавить другие методы для управления игроками:
	// public addPlayer(player: Player): void { ... }
	// public removePlayer(playerID: string): void { ... }
	// public getAllPlayers(): Player[] { ... }
}
//#endregion
