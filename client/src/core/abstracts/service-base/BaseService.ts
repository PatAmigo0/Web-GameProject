import type { IInitializiable } from '@gametypes/core.types';
import type { GameService } from '@services/GameService';

export abstract class BaseService extends Phaser.Events.EventEmitter implements IInitializiable {
	constructor(protected game: GameService) {
		super();
	}

	abstract init(...args: any[]): any;
}
