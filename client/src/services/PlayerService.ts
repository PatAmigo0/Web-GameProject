//#region IMPORTS
import { BaseService } from '@abstracts/service-base/BaseService';
import { Player } from '@components/entities/Player';
import { injectInitializator } from '@decorators/InjectInitializator.decorator';
import type { IInitializiable } from '@gametypes/core.types';
//#endregion

//#region CLASS DEFINITION
@injectInitializator((service: PlayerService) => {
	service.localPlayer = new Player();
})
export class PlayerService extends BaseService implements IInitializiable {
	//#region CLASS ATTRIBUTES
	private players = new Map<string, Player>();
	private localPlayer!: Player; // локальный игрок, т.е игрок браузера
	//#endregion

	//#region
	public declare init: (service: PlayerService) => any;
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
}
//#endregion
