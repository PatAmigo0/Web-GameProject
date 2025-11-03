// src/types/phaser.d.ts

import 'phaser';

import { GameService } from '@services/GameService';
import { TypedScene } from '@core/abstracts/scenes/TypedScene';

declare global {
	namespace Phaser {
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
