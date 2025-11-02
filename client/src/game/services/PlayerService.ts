//#region IMPORTS
import { Player } from '../components/entities/Player';
//#endregion

//#region CLASS DEFINITION
export class Players {
	//#region CLASS ATTRIBUTES
	private players: Player[] = [];
	//#endregion

	//#region PUBLIC METHODS
	/**
	 * Возвращает игрока по его уникальному ID.
	 * @param playerID ID игрока для поиска
	 * @returns Объект Player или undefined, если игрок не найден
	 */
	public getPlayerByID(playerID: string): Player | undefined {
		return this.players.find((plr) => plr.playerID == playerID);
	}
	//#endregion

	// TODO: добавить другие методы для управления игроками:
	// public addPlayer(player: Player): void { ... }
	// public removePlayer(playerID: string): void { ... }
	// public getAllPlayers(): Player[] { ... }
}
//#endregion
