// src/services/EventService.ts

import { BaseService } from '@abstracts/service/BaseService';
import { GAME_EVENT_TYPES } from '@config/events.config';
import { STARTING_MENU } from '@config/game.config';

export class EventService extends BaseService {
	public init() {
		this.setupCommonListeners();
		this.setupUncommonListeners();
	}

	private setupCommonListeners(): void {
		this.game.events.on('blur', () =>
			this.game.events.emit(GAME_EVENT_TYPES.INPUT_RESET),
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
				STARTING_MENU,
			);
		});

		this.game.events.addListener(
			GAME_EVENT_TYPES.MAIN_SCENE_CHANGE,
			(sceneKey: string) => {
				this.game.scene.changeMainScene(sceneKey);
			},
		);
	}
}
