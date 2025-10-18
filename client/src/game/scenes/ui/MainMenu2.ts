import type { NetworkService } from '../../services/NetworkService';
import { SceneKey } from '../../utils/decorators/SceneKey.decorator';

@SceneKey('TMainMenuScene')
export class TMainMenuScene extends Phaser.Scene {
	private NetworkService!: NetworkService;

	create(): void {
		this.NetworkService = this.registry.get('NetworkService');

		const button = this.add
			.text(this.cameras.main.centerX, 100, 'TEST', {
				fontSize: '24px',
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });
	}
}
