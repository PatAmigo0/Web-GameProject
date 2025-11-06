const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export enum Keys {
	// WASD
	W = 'KeyW',
	A = 'KeyA',
	S = 'KeyS',
	D = 'KeyD',

	// Стрелки
	LEFT = 'ArrowLeft',
	RIGHT = 'ArrowRight',
	UP = 'ArrowUp',
	DOWN = 'ArrowDown',

	// Другое
	SPACE = 'Space',
	SHIFT = 'ShiftLeft',
	CTRL = 'ControlLeft',
	ENTER = 'Enter',
}

export const PhaserKeys = {
	[Keys.W]: KeyCodes.W,
	[Keys.A]: KeyCodes.A,
	[Keys.S]: KeyCodes.S,
	[Keys.D]: KeyCodes.D,
	[Keys.SPACE]: KeyCodes.SPACE,
} as const;
