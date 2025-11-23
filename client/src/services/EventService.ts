// src/services/EventService.ts

import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { GameEvents } from '@gametypes/event.types';

/**
 * Сервис событий, который обрабатывает базовые события
 */
@injectInitializator(async (service: EventService) => {
	service.setupCommonListeners();
})
export class EventService extends StandaloneService {
	constructor(private events: Phaser.Events.EventEmitter, private targetDomContainer: HTMLDivElement) {
		super();
	}

	public declare init: (service: EventService) => void;

	private setupCommonListeners(): void {
		// если игрок потерял фокус на страницу то ресетаем input
		this.events.on('blur', () => this.events.emit(GameEvents.INPUT_RESET));
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) this.events.emit(GameEvents.INPUT_RESET);
		});

		// блокирует context menu в canvas (сценах)
		// this.game.canvas.addEventListener('contextmenu', (e: PointerEvent) => e.preventDefault());

		// блокирует context menu в domContainer (страница над phaser canvas)
		this.targetDomContainer.addEventListener('contextmenu', (e: PointerEvent) => e.preventDefault());
	}
}
