import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import { CacheComponent } from '@components/shared/CacheComponent';
import type { Logger } from '@components/shared/LoggerComponent';
import { CacheKeys, CacheNames } from '@config/cache.config';
import { baseAuthAction } from '@decorators/baseAuthAction.decorator';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { LoginDto, RegisterDto } from '@game/shared';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys } from '@gametypes/scene.types';
import type { NetworkService } from '@services/NetworkService';

@injectLogger()
@injectInitializator(async (service: AuthService) => {
	service.userCache = new CacheComponent(CacheNames.User).setSettings({ alwaysSave: true });
})
export class AuthService extends StandaloneService {
	public declare logger: Logger;
	public declare init: () => void;
	public declare userCache: CacheComponent;

	constructor(private networkService: NetworkService, private events: Phaser.Events.EventEmitter) {
		super();
	}

	/**
	 * Попытка авторизации
	 * @param info DTO для входа или true для попытки взять из кэша
	 * @param method Метод авторизации
	 */
	public async tryAuth(info: LoginDto | boolean, method: 'login' | 'register') {
		const ping = await this.networkService.ping();
		if (!ping.ok) return;

		let authData: LoginDto | RegisterDto;

		if (typeof info === 'boolean') {
			const cachedInfo = this.userCache.get(CacheKeys.AuthInfo) as LoginDto;

			if (!cachedInfo || method === 'register') {
				this.logger.warn('Не могу войти автоматически: нет данных в кэше');
				this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
				return;
			}
			authData = cachedInfo;
		} else authData = info;

		const response: Response = await (this as any)[method](authData);
		if (response.ok) {
			this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
		} else {
			if (response.status < 500) {
				this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
			}
		}
	}

	public logout() {
		this.userCache.clear();
		window.location.reload();
	}

	@baseAuthAction
	public async register(registerDto: RegisterDto): Promise<Response> {
		const response = await this.networkService.request('/api/auth/registration', {
			method: 'POST',
			body: JSON.stringify(registerDto),
		});

		if (response.ok) {
			this.cacheAuthData({
				login: registerDto.login,
				password: registerDto.password,
			});
		}

		return response;
	}

	@baseAuthAction
	public async login(info: LoginDto): Promise<Response> {
		const response = await this.networkService.request('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(info),
		});

		if (response.ok) {
			this.cacheAuthData(info);
		}

		return response;
	}

	private cacheAuthData(info: LoginDto) {
		if (!this.userCache.exists(CacheKeys.AuthInfo)) {
			this.userCache.add(CacheKeys.AuthInfo, info);
		}
	}
}
