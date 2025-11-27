import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import type { Logger } from '@components/shared/LoggerComponent';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys } from '@gametypes/scene.types';
import type { ColyseusService } from '@services/ColyseusService';

@injectLogger()
@injectInitializator(async () => {})
export class RoomService extends StandaloneService {
	private declare logger: Logger;
	public declare init: () => void;

	constructor(private events: Phaser.Events.EventEmitter, private colyseusService: ColyseusService) {
		super();
	}

	public async joinRoom(roomId: string, skip?: boolean) {
		if (!skip) {
		}
		const room = await this.colyseusService.setupRoomWs(roomId);

		// Если мы сюда дошли, то значит что мы успешно зашли в комнату
		this.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.CharacterTestPlace, room);
		return room;
	}
}
