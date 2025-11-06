import { BaseGameScene } from '@abstracts/scene/BaseGameScene';
import { SceneInfo } from '@decorators/SceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.CharacterTestPlace, SceneTypes.GameScene)
export class CharacterTestPlace extends BaseGameScene {
	onPreload(): void {}

	onCreate(): void {}

	heartbeat(time?: number, delta?: number): void {}

	onShutdown(): void {}
}
