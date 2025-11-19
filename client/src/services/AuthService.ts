import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import { CacheComponent } from '@components/shared/CacheComponent';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys } from '@gametypes/scene.types';
import type { Logger } from '@utils/Logger.util';
import type { LoginDto, RegisterDto } from '../../../packages/shared/dist';
import type { NetworkService } from './NetworkService';

@injectLogger()
@injectInitializator((service: AuthService) => {
	service.userCache = new CacheComponent('network-login-cache').setSettings({ alwaysSave: true });
})
export class AuthService extends StandaloneService {
	private declare logger: Logger;
	public declare init: () => void;
	private declare userCache: CacheComponent;

	constructor(private networkService: NetworkService, private events: Phaser.Events.EventEmitter) {
		super();
	}

	public async tryAuth(info: LoginDto | boolean, method: 'login' | 'register') {
		const ping = await this.networkService.ping();
		if (ping.ok) {
			if (typeof info === 'boolean') {
				this.userCache.add('login', { login: 'tohue', password: '6996' } as LoginDto);
				info = this.userCache.get('login') as LoginDto;
				if (!info || method == 'register') {
					this.logger.warn('Не могу войти автоматически');
					this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
					return this.networkService.badResponse();
				}
			}

			const response = await this[method](info);
			if (response.ok) {
				this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MainMenu);
			} else if (this.networkService.isSafeResponse(response.status)) {
				this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.LoginScene);
			}
		}
	}

	public async register(registerDto: RegisterDto) {
		const response = await this.networkService.sendRegistrationRequest(registerDto);
		if (response.ok) {
			const data = await response.json();
			this.logger.log('Регистрация прошла успешно:', data);

			if (!this.userCache.exists('login')) {
				this.userCache.add('login', {
					login: registerDto.login,
					password: registerDto.password,
				} as LoginDto);
			}
		}

		return response;
	}

	public async login(info: LoginDto) {
		const response = await this.networkService.sendLoginRequest(info);
		if (response.ok) {
			const data = await response.json();
			this.logger.log('Вход в систему прошел успешно:', data);

			if (!this.userCache.exists('login')) {
				this.userCache.add('login', info);
			}
		}

		return response;
	}
}
