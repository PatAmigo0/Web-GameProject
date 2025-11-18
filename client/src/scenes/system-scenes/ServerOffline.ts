import { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.OfflineScene, SceneTypes.HTMLScene)
export class ServerOfflineScene extends WithPhaserLifecycle {
	private offlineText!: Phaser.GameObjects.Text;

	public preload(): void {
		this.offlineText = this.add
			.text(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2,
				'К сожалению сервер сейчас не в сети...\nНо возможно, что когда-нибудь он вернется!\nА пока что... попробуйте зайти позже',
				{
					color: '#ffffff',
					fontSize: '24px',
				},
			)
			.setOrigin(0.5);
	}

	public shutdown(): void {
		this.offlineText.destroy();
	}
}
