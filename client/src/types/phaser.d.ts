// src/types/phaser.d.ts

import 'phaser';

import { TypedScene } from '@abstracts/scenes/TypedScene';
import type { SceneManager } from '@managers/SceneManager';
import { GameService } from '@services/GameService';

declare global {
	namespace Phaser {
		interface Game {
			readonly scene: SceneManager;
		}

		interface Scene {
			readonly game: GameService;
		}

		namespace Scenes {
			interface SceneManager {
				scenes: TypedScene[];
				getScene<T extends TypedScene>(key: string): T;
			}

			interface ScenePlugin {
				get<T extends TypedScene>(key: string): T;
				run<T extends TypedScene>(key: string, data?: object): T;
			}
		}
	}
}

export {};
