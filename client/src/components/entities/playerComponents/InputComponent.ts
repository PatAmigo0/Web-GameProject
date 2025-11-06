import { KEYBOARD_LISTENING_KEYS } from '@config/controls.config';
import type {
	InputSignal,
	InputState,
	InputStateAggregation,
} from '@gametypes/player.types';

export class InputComponent {
	private inputState: InputState = {
		[KEYBOARD_LISTENING_KEYS.MOVE_UP]: false,
		[KEYBOARD_LISTENING_KEYS.MOVE_LEFT]: false,
		[KEYBOARD_LISTENING_KEYS.MOVE_DOWN]: false,
		[KEYBOARD_LISTENING_KEYS.MOVE_RIGHT]: false,
		[KEYBOARD_LISTENING_KEYS.ACTION]: false,
	};
	private isdiagonal: boolean = false;

	public changeInputState(inputSignal: InputSignal): void {
		console.debug(
			`[InputComponent] меняю state: ${inputSignal.key} ${
				this.inputState[inputSignal.key]
			} -> ${!this.inputState[inputSignal.key]}`,
		);
		this.inputState[inputSignal.key] = inputSignal.state;

		// нет смысла проверять на диагональ если у нас был action
		if (inputSignal.key != KEYBOARD_LISTENING_KEYS.ACTION) {
			this.isdiagonal = this.checkForDiagonal();
		}
	}

	public getInputState(): InputStateAggregation {
		return {
			inputState: { ...this.inputState },
			isdiagonal: this.isdiagonal,
		} as InputStateAggregation;
	}

	public resetAction(): void {
		this.inputState[KEYBOARD_LISTENING_KEYS.ACTION] = false;
	}

	private checkForDiagonal(): boolean {
		const horizontalMovement =
			this.inputState[KEYBOARD_LISTENING_KEYS.MOVE_LEFT] ||
			this.inputState[KEYBOARD_LISTENING_KEYS.MOVE_RIGHT];
		const verticalMovement =
			this.inputState[KEYBOARD_LISTENING_KEYS.MOVE_UP] ||
			this.inputState[KEYBOARD_LISTENING_KEYS.MOVE_DOWN];

		return horizontalMovement && verticalMovement;
	}
}
