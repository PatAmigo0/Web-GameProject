// src/types/phaser.d.ts

import 'phaser';

import type { WithPhaserLifecycle } from '@abstracts/scene/WithPhaserLifecycle';
import type { SceneManager } from '@managers/SceneManager';
import { GameService } from '@services/GameService';

declare global {
	namespace Phaser {
		namespace Loader {
			type AwaitCallback = (
				successCallback: () => void,
				failureCallback: () => void,
			) => void;

			interface LoaderPlugin {
				/**
				 * Ставит в очередь загрузчика асинхронную задачу (Promise, fetch и т.д.).
				 * Загрузчик Phaser приостановит выполнение, пока не будет вызван
				 * `successCallback` или `failureCallback`.
				 * * Требует плагин RexAwaitLoader.
				 * @param callback Функция, выполняющая асинхронную операцию.
				 */
				rexAwait(callback: AwaitCallback): this;

				/**
				 * Альтернативная/старая версия маппинга плагина (на всякий случай).
				 * @deprecated await -> rexAwait
				 */
				await(callback: AwaitCallback): this;
			}
		}

		interface Game {
			readonly scene: SceneManager;
		}

		interface Scene {
			readonly game: GameService;
		}

		namespace Scenes {
			interface SceneManager {
				scenes: WithPhaserLifecycle[];
				getScene<T extends WithPhaserLifecycle>(key: string): T;
				stop<T extends WithPhaserLifecycle>(
					key: string | T,
					data?: object,
				): this;
			}

			interface ScenePlugin {
				get<T extends WithPhaserLifecycle>(key: string): T;
				run<T extends WithPhaserLifecycle>(
					key: string,
					data?: object,
				): T;
			}
		}
	}
}

export {};
