// src/types/core.types.ts

import type { AnimatorComponent } from '@components/entities/playerComponents/AnimatorComponent';
import type { InputComponent } from '@components/entities/playerComponents/InputComponent';
import type { GameService } from '@services/GameService';

// Функциональные типы
export type BaseFunction = () => void;

//  Общие интерфейсы
export interface IInitializiable {
	init: () => any;
}

export interface IUpdatable {
	update: (...args: any) => void;
}

export interface IInputable {
	keyinput: InputComponent;
}

export interface IAnimatable {
	animator: AnimatorComponent;
}

export interface IGameContextAware {
	game: GameService;
}
