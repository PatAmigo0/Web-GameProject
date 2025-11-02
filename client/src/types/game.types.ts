// src/types/game.types.ts

export type GameData =
	| {
			type: 'move';
			x: number;
			y: number;
	  }
	| {
			type: 'spawn';
			x: number;
			y: number;
	  };
