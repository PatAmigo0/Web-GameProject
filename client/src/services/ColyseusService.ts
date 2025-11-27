import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import { CacheComponent } from '@components/shared/CacheComponent';
import type { Logger } from '@components/shared/LoggerComponent';
import { CacheKeys, CacheNames } from '@config/cache.config';
import { WS_URL } from '@config/core.config';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import { BaseGameRoomState, type CreateRoomDto } from '@game/shared';
import { type UserBaseInfo } from '@gametypes/cache.types';
import * as Colyseus from 'colyseus.js';
import type { NetworkService } from './NetworkService';

@injectLogger()
@injectInitializator(async (service: ColyseusService) => {
	service.client = new Colyseus.Client(WS_URL);
})
export class ColyseusService extends StandaloneService {
	private declare logger: Logger;
	public declare init: () => void;

	private client: Colyseus.Client;
	private userCache = new CacheComponent(CacheNames.User);

	public activeRoom!: Colyseus.Room<BaseGameRoomState>;

	constructor(private networkService: NetworkService) {
		super();
	}

	public async createRoom(roomCreateDto: CreateRoomDto) {
		return this.protectedRequest('/api/protected/rooms/create', {
			method: 'POST',
			body: JSON.stringify(roomCreateDto),
		});
	}

	public async queryRoomId(id: string) {
		return this.protectedRequest(`/api/protected/rooms/join/${id}`);
	}

	public async setupRoomWs(id: string) {
		this.activeRoom = await this.client.joinById<BaseGameRoomState>(id, {
			accessToken: this.userCache.get<UserBaseInfo>(CacheKeys.UserBaseInfo).token,
		});

		return this.activeRoom;
	}

	public async getRooms() {
		const response = await this.protectedRequest('/api/protected/rooms/list');
		const rooms = (await response.json()).data;
		return rooms;
	}

	public async leave() {
		if (this.activeRoom) {
			this.activeRoom.leave();
			this.activeRoom = null;
		}
	}

	private protectedRequest(endpoint: string, options: RequestInit = {}) {
		const headers = {
			Authorization: `Bearer ${this.userCache.get<UserBaseInfo>(CacheKeys.UserBaseInfo).token}`,
			...options.headers,
		};

		const config: RequestInit = {
			...options,
			headers,
		};

		return this.networkService.request(endpoint, config);
	}
}
