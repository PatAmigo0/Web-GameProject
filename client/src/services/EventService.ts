// src/services/EventService.ts

import { BaseService } from '@abstracts/service/BaseService';
import { GAME_EVENT_TYPES } from '@config/events.config';
import { STARTING_SCENE } from '@config/game.config';

/**
 * Сервис событий, который обрабатывает почти все возможные события
 */
export class EventService extends BaseService {
	public init() {
		this.setupCommonListeners();
		this.setupUncommonListeners();
	}

	private setupCommonListeners(): void {
		// если игрок потерял фокус на страницу то ресетаем input
		this.game.events.on('blur', () =>
			this.game.userInputService.emit(GAME_EVENT_TYPES.INPUT_RESET),
		);

		// блокирует context menu в canvas (сценах)
		this.game.canvas.addEventListener('contextmenu', (e: PointerEvent) =>
			e.preventDefault(),
		);

		this.game.domContainer.addEventListener(
			// блокирует context menu в domContainer (страница над phaser)
			'contextmenu',
			(e: PointerEvent) => e.preventDefault(),
		);
	}

	private setupUncommonListeners(): void {
		this.game.events.addListener(GAME_EVENT_TYPES.BOOT, () => {
			this.game.events.emit(
				GAME_EVENT_TYPES.MAIN_SCENE_CHANGE,
				STARTING_SCENE,
			);
		});

		// событие на изменение главной сцены
		this.game.events.addListener(
			GAME_EVENT_TYPES.MAIN_SCENE_CHANGE,
			(sceneKey: string) => {
				this.game.scene.changeMainScene(sceneKey);
			},
		);
	}
}
