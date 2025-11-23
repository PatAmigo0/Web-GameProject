import { CacheKeys } from '@config/cache.config';
import type { LoginDto } from '@game/shared';
import type { UserBaseInfo } from '@gametypes/cache.types';
import type { AuthService } from '@services/AuthService';

export function baseAuthAction<T extends AuthService>(_: T, __: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value! as Function;

	descriptor.value = async function (this: T, ...args: any[]) {
		const response = (await originalMethod.call(this, ...args)) as Response;
		const data = await response.json();
		this.userCache.add(CacheKeys.UserBaseInfo, {
			token: data.data.token,
			uuid: data.data.uuid,
			login: (this.userCache.get(CacheKeys.AuthInfo) as LoginDto).login,
		} as UserBaseInfo);

		this.logger.debug('baseAuthAction success.', this.userCache.get(CacheKeys.UserBaseInfo));
		return response;
	};
}
