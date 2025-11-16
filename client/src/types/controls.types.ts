// src/types/controls.types.ts

import { type ACTION_MAP } from '@config/controls.config';

export type Action = keyof typeof ACTION_MAP;

export type InputStateByAction = {
	[key in Action]: boolean;
};

export type MovementState = Pick<InputStateByAction, 'MOVE_UP' | 'MOVE_RIGHT' | 'MOVE_LEFT' | 'MOVE_DOWN'>;
export type MovementStateKey = keyof MovementState;

export type ActionKeyValues = (typeof ACTION_MAP)[Action];
export type KeyStateByValue = {
	[key in ActionKeyValues]: boolean;
};

export type InputSignal = {
	action: Action;
	state: boolean;
};

export type InputStateAggregation = {
	inputState: InputStateByAction;
	isdiagonal: boolean;
};

export type KeyInformation = {
	baseKey: ActionKeyValues;
	phaserKey: number;
};

export type MappedKeyInfo = KeyInformation & {
	action: Action;
};
