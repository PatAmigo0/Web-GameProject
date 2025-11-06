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
