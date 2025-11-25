// src/types/events.types.ts

export const GameEvents = {
	BOOT: 'BOOT',
	MAIN_SCENE_CHANGE: 'MAIN_SCENE_CHANGE',
	SUB_SCENE_CHANGE: 'SUB_SCENE_CHANGE', // при вызове этого события обязательно передавать ключ исходной сцены
	INPUT_RESET: 'INPUT_RESET',
} as const;

export const NetworkEvents = {
	CONNECTION_LOST: 'NETWORK_CONNECTION_LOST',
	CONNECTION_RESTORED: 'NETWORK_CONNECTION_RESTORED',
} as const;

export const CharacterEvents = {
	CHARACTER_ADDED: 'CHARACTER_ADDED',
	CHARACTER_REMOVING: 'CHARACTER_REMOVING',
} as const;

export const KeyboardEvents = {
	KEY_UP: 'keyup',
	KEY_DOWN: 'keydown',
	KEY_PRESSED: 'keypressed',
} as const;

export const TransitionEvents = {
	ELEMENT_READY: 'element-ready',
	TRANSITION_READY: 'transition-ready',
	TRANSITION_FINISHED: 'transition-finished',
} as const;

export const SceneEvents = {
	SCENE_IS_READY_TO_RUN: 'srtr',
} as const;

type eventFunction = (event: string, callback: (...args: any[]) => any, extra?: any) => void;

export interface IEventable {
	addEventListener: eventFunction;
	removeEventListener: eventFunction;
	on?: Function;
}
