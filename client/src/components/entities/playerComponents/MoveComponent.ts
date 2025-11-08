import { KEYBOARD_LISTENING_KEYS } from '@config/controls.config';
import { MOVE_SPEED } from '@config/game.config';
import {
	MovementType,
	type InputStateAggregation,
	type MoveState,
} from '@gametypes/player.types';

export class MoveComponent {
	private body!: Phaser.Physics.Arcade.Body;
	private states!: MoveState;
	private speed: number = MOVE_SPEED;
	private diagonalSpeed: number = MOVE_SPEED / Math.sqrt(2);
	private xMultiplier: number = 1;
	private yMultiplier: number = 1;

	constructor(body: Phaser.Physics.Arcade.Body) {
		this.body = body;
		this.states = {
			[KEYBOARD_LISTENING_KEYS.MOVE_UP]: {
				state: false,
				handler: this.body.setVelocityY.bind(this),
				direction: MovementType.Vertical,
			},
			[KEYBOARD_LISTENING_KEYS.MOVE_LEFT]: {
				state: false,
				handler: this.body.setVelocityX.bind(this),
				direction: MovementType.Horizontal,
			},
			[KEYBOARD_LISTENING_KEYS.MOVE_DOWN]: {
				state: false,
				handler: this.body.setVelocityY.bind(this),
				direction: MovementType.Vertical,
			},
			[KEYBOARD_LISTENING_KEYS.MOVE_RIGHT]: {
				state: false,
				handler: this.body.setVelocityX.bind(this),
				direction: MovementType.Horizontal,
			},
		};
	}

	public update(inputStateAggregation: InputStateAggregation): void {
		const inputState = inputStateAggregation.inputState;
		const isDiagonal = inputStateAggregation.isdiagonal;

		this.resetVelocity();

		Object.entries(inputState).forEach(([key, state]) => {
			if (this.keyChecker(key)) {
				if (state) this[key]();
				else this.states[key].state = false;
			}
		});

		if (isDiagonal) {
			this.body.setVelocity(
				this.diagonalSpeed * this.xMultiplier,
				this.diagonalSpeed * this.yMultiplier,
			);
		} else {
			for (const stateInfo of Object.values(this.states)) {
				if (stateInfo.state) {
					stateInfo.handler(
						this.speed *
							(stateInfo.direction == MovementType.Horizontal
								? this.xMultiplier
								: this.yMultiplier),
					);
				}
			}
		}
	}

	//#region Кастомные handlers для сложной логики
	private [KEYBOARD_LISTENING_KEYS.MOVE_UP](): void {
		if (!this.states[KEYBOARD_LISTENING_KEYS.MOVE_DOWN].state) {
			this.states[KEYBOARD_LISTENING_KEYS.MOVE_UP].state = true;
			this.yMultiplier = -1;
		}
	}
	private [KEYBOARD_LISTENING_KEYS.MOVE_LEFT](): void {
		if (!this.states[KEYBOARD_LISTENING_KEYS.MOVE_RIGHT].state) {
			this.states[KEYBOARD_LISTENING_KEYS.MOVE_LEFT].state = true;
			this.xMultiplier = -1;
		}
	}
	private [KEYBOARD_LISTENING_KEYS.MOVE_DOWN](): void {
		if (!this.states[KEYBOARD_LISTENING_KEYS.MOVE_UP].state) {
			this.states[KEYBOARD_LISTENING_KEYS.MOVE_DOWN].state = true;
			this.yMultiplier = 1;
		}
	}
	private [KEYBOARD_LISTENING_KEYS.MOVE_RIGHT](): void {
		if (!this.states[KEYBOARD_LISTENING_KEYS.MOVE_LEFT].state) {
			this.states[KEYBOARD_LISTENING_KEYS.MOVE_RIGHT].state = true;
			this.xMultiplier = 1;
		}
	}
	//#endregion

	private resetVelocity() {
		this.body.setVelocity(0, 0);
	}

	private keyChecker(key: string): key is keyof MoveState {
		return key in this.states;
	}
}
