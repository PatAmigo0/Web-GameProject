// src/config/controls.config.ts

import type { Action } from '@gametypes/controls.types';
import { Keys } from './keyboard.config';

export const Actions = {
	MoveUp: 'MOVE_UP',
	MoveLeft: 'MOVE_LEFT',
	MoveDown: 'MOVE_DOWN',
	MoveRight: 'MOVE_RIGHT',
	Interact: 'INTERACT',
} as const;

export const ACTION_MAP = {
	[Actions.MoveUp]: Keys.W,
	[Actions.MoveLeft]: Keys.A,
	[Actions.MoveDown]: Keys.S,
	[Actions.MoveRight]: Keys.D,
	[Actions.Interact]: Keys.SPACE,
} as const;

export const MOVEMENT_ACTIONS = new Set<Action>([
	Actions.MoveUp,
	Actions.MoveLeft,
	Actions.MoveRight,
	Actions.MoveDown,
]);

export const HORIZONTAL_ACTIONS = new Set<Action>([Actions.MoveLeft, Actions.MoveRight]);

export const VERTICAL_ACTIONS = new Set<Action>([Actions.MoveUp, Actions.MoveDown]);

export const MOVEMENT_MULTIPLIERS = {
	[Actions.MoveUp]: -1,
	[Actions.MoveLeft]: -1,
	[Actions.MoveDown]: 1,
	[Actions.MoveRight]: 1,
} as const;
