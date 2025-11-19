// src/services/NetworkService.ts
import { BaseService } from '@abstracts/service-base/BaseService';
import { TRANSFER_HOST } from '@config/core.config';
import { REQUEST_TIMEOUT } from '@config/network.config';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import { HttpStatus, type LoginDto, type RegisterDto } from '@game/shared';
import { GameEvents } from '@gametypes/event.types';
import { StatusCodes } from '@gametypes/network.types';
import { SceneKeys } from '@gametypes/scene.types';
import type { SceneManager } from '@managers/SceneManager';
import type { Logger } from '@utils/Logger.util';
import { ObjectUtils } from '@utils/Object.util';
import type { GameService } from './GameService';

@injectLogger()
@injectInitializator((service: NetworkService) => {
	service.online = true;
})
export class NetworkService extends BaseService {
	private declare logger: Logger;
	public declare init: () => void;
	private online: boolean;

	constructor(
		game: GameService,
		private events: Phaser.Events.EventEmitter,
		private sceneManager: SceneManager,
	) {
		super(game);
	}

	/**
	 *
	 * @returns Pong!
	 */
	public ping() {
		return this.sfetch(`${TRANSFER_HOST}/api/probing/ping`);
	}

	public sendRegistrationRequest(registerDto: RegisterDto) {
		return this.sfetch(`${TRANSFER_HOST}/api/auth/registration`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(registerDto),
		});
	}

	public sendLoginRequest(loginDto: LoginDto) {
		return this.sfetch(`${TRANSFER_HOST}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginDto),
		});
	}

	/**
	 * Служит созданием ответа на запрос об сервной ошибке
	 * @returns Экзэмпляр упавшего запроса (статус - 500)
	 */
	public failedResponse() {
		return new Response(null, { status: StatusCodes.SERVER_OFFLINE });
	}

	/**
	 *
	 * @returns Экзэмпляр плохого запроса (статус - 400)
	 */
	public badResponse() {
		return new Response(null, { status: StatusCodes.BAD_REQUEST });
	}

	public isSafeResponse(status: Number) {
		return status !== HttpStatus.InternalServerError;
	}

	/**
	 * Полное имя - Secure Fetch
	 * - Инкапсулирует логику обработки запроса
	 * - В случае ошибки всего возвращает response со статусом 500 и ok = false
	 * @param input
	 * @param init
	 * @returns
	 */
	private async sfetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
		if (!this.online) {
			console.error('Невозможно отправить запрос: клиент не в сети');
			return this.failedResponse();
		}

		if (!init) init = {};

		let response;
		try {
			init.signal = AbortSignal.timeout(REQUEST_TIMEOUT); // ставим максимальное время ожидания запроса
			response = await fetch(input, init);
			if (response.status == HttpStatus.InternalServerError) {
				throw new Error('Server Error');
			}
			return response;
		} catch (e) {
			this.logger.warn('Ошибка во время запроса: ', e);

			if (!response || response.status == StatusCodes.SERVER_OFFLINE) {
				this.logger.warn('Going offline...');
				this.online = false;
				ObjectUtils.freezeProperty(this, 'online');

				this.sceneManager.scenes.forEach((scene) => {
					this.game.scene.stop(scene);
				});

				this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.OfflineScene);
			}

			return this.failedResponse(); // отправляем пустой ответ с кодом 500 (::ERR_FAILURE)
		}
	}
}
