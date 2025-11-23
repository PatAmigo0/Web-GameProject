import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { SceneEvents } from '@gametypes/event.types';
import { SceneKeys } from '@gametypes/scene.types';
import type { SceneManager } from '@managers/SceneManager';
import type { NotificationScene } from '@scenes/system-scenes/Notifications';

@injectInitializator(async (service: NotificationService) => {
	service.sceneManager
		.getScene(SceneKeys.Notifications)
		.events.once(SceneEvents.SCENE_IS_READY_TO_RUN, (scene: NotificationScene) => {
			service.notificationScene = scene;
		});
})
export class NotificationService extends StandaloneService {
	private notificationScene: NotificationScene;

	constructor(
		private sceneManager: SceneManager,
		/** @ts-ignore */
		private events: Phaser.Events.EventEmitter,
	) {
		super();
	}

	public declare init: () => void;

	public show(message: string, type: 'success' | 'error' | 'info') {
		if (!this.notificationScene) return;
		this.notificationScene.show(message, type);
	}

	public clearAll() {
		if (!this.notificationScene) return;
		this.notificationScene.clearAll();
	}
}
