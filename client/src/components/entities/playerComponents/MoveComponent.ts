import { MOVEMENT_MULTIPLIERS, VERTICAL_ACTIONS } from '@config/controls.config';
import { DIAGONAL_MOVE_SPEED, MOVE_SPEED } from '@config/movement.config';
import type { MovementState, MovementStateKey } from '@gametypes/controls.types';
import type { IUpdatable } from '@gametypes/core.types';

export class MoveComponent implements IUpdatable {
	private targetBody!: Phaser.Physics.Arcade.Body;
	private queue = new Set<MovementStateKey>();

	constructor(targetBody: Phaser.Physics.Arcade.Body) {
		this.targetBody = targetBody;
	}

	public update(movementState: MovementState): void {
		this.updateQueue(movementState);
		this.move();
	}

	private updateQueue(movementState: MovementState): void {
		(Object.entries(movementState) as [MovementStateKey, boolean][]).forEach(([action, state]) => {
			if (this.queue.has(action)) {
				if (!state) {
					this.queue.delete(action);
				}
			} else if (state) {
				this.queue.add(action);
			}
		});
	}

	private move(): void {
		let xMultiplier = 0;
		let yMultiplier = 0;

		let foundHorizontal = false;
		let foundVertical = false;

		const normalizedQueue = [...this.queue];
		for (let i = normalizedQueue.length - 1; i >= 0; i--) {
			const action = normalizedQueue[i];

			if (VERTICAL_ACTIONS.has(action)) {
				if (!foundVertical) {
					foundVertical = true;
					yMultiplier = MOVEMENT_MULTIPLIERS[action];
				}
			} else {
				if (!foundHorizontal) {
					foundHorizontal = true;
					xMultiplier = MOVEMENT_MULTIPLIERS[action];
				}
			}

			if (foundHorizontal && foundVertical) {
				this.targetBody.setVelocity(
					DIAGONAL_MOVE_SPEED * xMultiplier,
					DIAGONAL_MOVE_SPEED * yMultiplier,
				);
				return;
			}
		}

		this.targetBody.setVelocity(MOVE_SPEED * xMultiplier, MOVE_SPEED * yMultiplier);
	}
}
