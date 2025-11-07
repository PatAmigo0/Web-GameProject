import { BaseHtmlScene } from '@abstracts/scene/BaseHtmlScene';
import { GAME_EVENT_TYPES } from '@config/events.config';
import { SceneInfo } from '@decorators/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.LoginScene, SceneTypes.UIScene)
export class LoginScene extends BaseHtmlScene {
	public onPreload(): void {}

	public onCreate(): void {
		const button = this.div.node.querySelector('#l') as HTMLButtonElement;
		console.log(button);
		button.addEventListener('click', () => {
			this.game.events.emit(
				GAME_EVENT_TYPES.MAIN_SCENE_CHANGE,
				SceneKeys.SignupScene,
			);
		});
	}

	public heartbeat(time?: number, delta?: number): void {}

	public onShutdown(): void {}
}
