import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import { CacheComponent } from '@components/shared/CacheComponent';
import { CacheKeys, CacheNames } from '@config/cache.config';
import { baseAuthAction } from '@decorators/baseAuthAction.decorator';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { LoginDto, RegisterDto } from '@game/shared';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys } from '@gametypes/scene.types';
import type { NetworkService } from '@services/NetworkService';
import type { Logger } from '@utils/Logger.util';

@injectLogger()
@injectInitializator((service: AuthService) => {
	service.userCache = new CacheComponent(CacheNames.User).setSettings({ alwaysSave: true });
})
export class AuthService extends StandaloneService {
	public declare logger: Logger;
	public declare init: () => void;
	public declare userCache: CacheComponent;

	constructor(private networkService: NetworkService, private events: Phaser.Events.EventEmitter) {
		super();
	}

	public async tryAuth(info: LoginDto | boolean, method: 'login' | 'register') {
		const ping = await this.networkService.ping();
		if (ping.ok) {
			if (typeof info === 'boolean') {
				info = this.userCache.get(CacheKeys.AuthInfo) as LoginDto;
				if (!info || method == 'register') {
					this.logger.warn('Не могу войти автоматически');
					this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
					return this.networkService.badResponse();
				}
			}

			const response = await this[method](info);
			if (response.ok) {
				this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
			} else if (this.networkService.isSafeResponse(response.status)) {
				this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
			}
		}
	}

	@baseAuthAction
	public async register(registerDto: RegisterDto) {
		const response = await this.networkService.sendRegistrationRequest(registerDto);
		if (response.ok) {
			if (!this.userCache.exists(CacheKeys.AuthInfo)) {
				this.userCache.add(CacheKeys.AuthInfo, {
					login: registerDto.login,
					password: registerDto.password,
				} as LoginDto);
			}
		}

		return response;
	}

	@baseAuthAction
	public async login(info: LoginDto) {
		const response = await this.networkService.sendLoginRequest(info);
		if (response.ok) {
			if (!this.userCache.exists('login')) {
				this.userCache.add('login', info);
			}
		}
		return response;
	}
}
