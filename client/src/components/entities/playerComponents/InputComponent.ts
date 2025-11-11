import { Actions } from '@config/controls.config';
import type { InputSignal, InputStateAggregation, InputStateByAction } from '@gametypes/controls.types';

export class InputComponent {
	private inputState: InputStateByAction = {
		[Actions.MoveUp]: false,
		[Actions.MoveLeft]: false,
		[Actions.MoveDown]: false,
		[Actions.MoveRight]: false,
		[Actions.Interact]: false,
	};
	private isdiagonal: boolean = false;

	public changeInputState(inputSignal: InputSignal): void {
		this.inputState[inputSignal.action] = inputSignal.state;

		if (inputSignal.action != Actions.Interact) {
			this.isdiagonal = this.checkForDiagonal();
		}
	}

	public getInputState(): InputStateAggregation {
		return {
			inputState: this.inputState,
			isdiagonal: this.isdiagonal,
		} as InputStateAggregation;
	}

	public resetAction(): void {
		this.inputState[Actions.Interact] = false;
	}

	private checkForDiagonal(): boolean {
		const horizontalMovement = this.inputState[Actions.MoveLeft] || this.inputState[Actions.MoveRight];
		const verticalMovement = this.inputState[Actions.MoveUp] || this.inputState[Actions.MoveDown];
		return horizontalMovement && verticalMovement;
	}
}
