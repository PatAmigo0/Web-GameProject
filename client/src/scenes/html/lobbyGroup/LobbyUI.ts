import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { GameEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.LobbyUIScene, SceneTypes.HTMLScene)
export class LobbyUIScene extends BaseHtmlScene {
	private menuButton!: HTMLButtonElement;
	private disconnectButton!: HTMLButtonElement;
	private pauseOverlay!: HTMLDivElement;
	private resumeButton!: HTMLButtonElement;

	public onPreload(): void {}

	public onCreate(): void {
		this._init_elements();
		this._init_events();
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	private _init_elements() {
		this.menuButton = this.div.querySelector('#game-menu-btn') as HTMLButtonElement;
		this.pauseOverlay = this.div.querySelector('#pause-menu') as HTMLDivElement;
		this.resumeButton = this.div.querySelector('#resume-btn') as HTMLButtonElement;
		this.disconnectButton = this.div.querySelector('#disconnect-btn') as HTMLButtonElement;
	}

	private _init_events() {
		this.menuButton.onclick = () => this.toggleMenu(true);

		this.resumeButton.onclick = () => this.toggleMenu(false);

		this.disconnectButton.onclick = async () => {
			await this.handleDisconnect();
		};

		this.input.keyboard!.on('keydown-ESC', () => {
			const isHidden = this.pauseOverlay.style.display === 'none';
			this.toggleMenu(isHidden);
		});
	}

	private toggleMenu(show: boolean) {
		this.pauseOverlay.style.display = show ? 'flex' : 'none';
	}

	private async handleDisconnect() {
		await this.game.colyseusService.leave();
		this.game.events.emit(GameEvents.MAIN_SCENE_CHANGE, SceneKeys.MenuWrapper);
	}
}
