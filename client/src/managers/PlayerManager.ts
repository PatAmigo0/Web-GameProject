import type { GameService } from '@services/GameService';

export class PlayerManager {
	private game!: GameService;

	constructor(game: GameService) {
		this.game = game;
		this.game;
	}
}
