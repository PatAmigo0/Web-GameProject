import type { IInitializiable } from '@gametypes/core.types';
import type { GameService } from '@services/GameService';

export abstract class BaseService
	extends Phaser.Events.EventEmitter
	implements IInitializiable
{
	protected game!: GameService;

	constructor(game: GameService) {
		super();
		this.game = game;
	}

	abstract init(): void;
}
