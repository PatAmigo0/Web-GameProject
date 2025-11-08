// src/types/player.types.ts

import type { KEYBOARD_LISTENING_KEYS } from '@config/controls.config';

//#region DIRECTION TYPES
/**
 * Типы для обозначения направления движения игрока
 * Использует unique symbol для гарантированной уникальности и предотвращения коллизий
 */
export type Direction = {
	readonly NORTH: unique symbol;
	readonly SOUTH: unique symbol;
	readonly EAST: unique symbol;
	readonly WEST: unique symbol;
};
//#endregion

export enum MovementType {
	Vertical = 'Vertical',
	Horizontal = 'Horizontal',
}

//#region PLAYER EVENT TYPES
/**
 * Типы событий, связанных с состоянием игрока
 * Используется в EventService
 */
export type PlayerEvent = {
	readonly HEALTH_CHANGED: unique symbol;
	readonly DIED: unique symbol;
};
//#endregion

export type InputState = {
	[key in KEYBOARD_LISTENING_KEYS]: boolean;
};

// export type InputSignal = {
// 	[K in KEYBOARD_LISTENING_KEYS]: {
// 		readonly [P in K]: boolean;
// 	};
// }[KEYBOARD_LISTENING_KEYS];

export type InputSignal = {
	key: KEYBOARD_LISTENING_KEYS;
	state: boolean;
};

export type InputStateAggregation = {
	inputState: InputState;
	isdiagonal: boolean;
};

export type MoveStateInfo = {
	state: boolean;
	handler: Function;
	direction: MovementType;
};

export type MoveState = {
	[KEYBOARD_LISTENING_KEYS.MOVE_UP]: MoveStateInfo;
	[KEYBOARD_LISTENING_KEYS.MOVE_LEFT]: MoveStateInfo;
	[KEYBOARD_LISTENING_KEYS.MOVE_DOWN]: MoveStateInfo;
	[KEYBOARD_LISTENING_KEYS.MOVE_RIGHT]: MoveStateInfo;
};
