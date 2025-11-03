// src/services/EventService.ts

import { EventTypes } from '@config/events.config';
import { STARTING_MENU } from '@config/game.config';
import type { GameService } from '@services/GameService';

export class EventService {
	private game: GameService;

	constructor(gameInstance: GameService) {
		this.game = gameInstance;
	}

	public init() {
		this.setupCommonListeners();
		this.setupUncommonListeners();
	}

	private setupCommonListeners(): void {
		this.game.events.on('blur', () =>
			this.game.events.emit(EventTypes.INPUT_RESET),
		);
		this.game.canvas.addEventListener('contextmenu', (e: PointerEvent) =>
			e.preventDefault(),
		);
	}

	private setupUncommonListeners(): void {
		this.game.events.addListener(EventTypes.BOOT, () => {
			this.game.events.emit(EventTypes.MAIN_SCENE_CHANGE, STARTING_MENU);
		});

		this.game.events.addListener(
			EventTypes.MAIN_SCENE_CHANGE,
			(sceneKey: string) => {
				this.game.scene.changeMainScene(sceneKey);
			},
		);
	}
}
