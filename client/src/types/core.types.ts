// src/types/core.types.ts

import type { AnimatorComponent } from '@components/entities/playerComponents/AnimatorComponent';
import type { InputComponent } from '@components/entities/playerComponents/InputComponent';
import type { GameService } from '@services/GameService';

// Классовые типы
export type BaseClass = { new (...args: any[]): {} };

// Функциональные типы
export type BaseFunction = () => void;

export type BaseInit = (...args: any[]) => any;

//  Общие интерфейсы
export interface IInitializiable {
	init: (...args: any[]) => any;
}

export interface IUpdatable {
	update: (...args: any[]) => void;
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
