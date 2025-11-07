import { BaseHtmlScene } from '@abstracts/scene/BaseHtmlScene';
import { SceneInfo } from '@decorators/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.SignupScene, SceneTypes.UIScene)
export class RegistrationScene extends BaseHtmlScene {
	public onPreload(): void {}

	public onCreate(): void {}

	public heartbeat(time?: number, delta?: number): void {}

	public onShutdown(): void {}
}
