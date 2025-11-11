// src/services/EventService.ts

import { BaseService } from '@abstracts/service-base/BaseService';
import { STARTING_SCENE } from '@config/scene.config';
import { GameEvents } from '@gametypes/event.types';

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
		this.game.events.on('blur', () => this.game.userInputService.emit(GameEvents.INPUT_RESET));

		// блокирует context menu в canvas (сценах)
		this.game.canvas.addEventListener('contextmenu', (e: PointerEvent) => e.preventDefault());

		// блокирует context menu в domContainer (страница над phaser)
		this.game.domContainer.addEventListener('contextmenu', (e: PointerEvent) => e.preventDefault());
	}

	private setupUncommonListeners(): void {
		this.game.events.addListener(GameEvents.BOOT, () => {
			this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, STARTING_SCENE);
		});

		// событие на изменение главной сцены
		this.game.events.addListener(GameEvents.MAIN_SCENE_CHANGE, (sceneKey: string) => {
			this.game.scene.changeMainScene(sceneKey);
		});
	}
}
