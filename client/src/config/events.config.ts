export const GAME_EVENT_TYPES = {
	BOOT: 'BOOT',
	MAIN_SCENE_CHANGE: 'MAIN_SCENE_CHANGE',
	INPUT_RESET: 'INPUT_RESET',
} as const;

export const PLAYER_EVENT_TYPES = {
	PLAYER_ADDED: 'PLAYER_ADDED',
	PLAYER_REMOVING: 'PLAYER_REMOVING',
} as const;

export const KEYBOARD_EVENT_TYPES = {
	KEY_UP: 'keyup', // НЕ ИЗМЕНЯТЬ
	KEY_DOWN: 'keydown', // НЕ ИЗМЕНЯТЬ
	KEY_PRESSED: 'GLOBAL_KEY_PRESSED',
} as const;

export const TRANSITION_MANAGER_EVENT_TYPES = {
	ELEMENT_READY: 'el_ready',
	TRANSITION_READY: 'tr_ready',
	TRANSITION_FINISHED: 'tr_finished',
} as const;

export const SCENE_EVENT_TYPES = {
	SCENE_IS_READY_TO_RUN: 'srtr',
} as const;
