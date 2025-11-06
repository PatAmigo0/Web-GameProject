import { MOVE_SPEED } from '@config/game.config';
import type { InputStateAggregation } from '@gametypes/player.types';

export class MoveComponent {
	private body!: Phaser.Physics.Arcade.Body;
	private speed: number = MOVE_SPEED;

	constructor(body: Phaser.Physics.Arcade.Body) {
		this.body = body;
	}

	public update(inputStateAggregation: InputStateAggregation): void {
		console.log(inputStateAggregation);
	}
}
