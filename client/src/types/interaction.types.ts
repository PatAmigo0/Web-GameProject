// src/types/interaction.types.ts
export interface InteractionConfig {
	key: string;
	x: number;
	y: number;
	width: number;
	height: number;
	minigame: SceneKeys;
	promptText: string;
}

export type SceneKeys =
	| 'TestPlace'
	| 'PuzzleMinigame'
	| 'ClickerMinigame'
	| 'BootScene'
	| string; // на случай кастомных сцен
