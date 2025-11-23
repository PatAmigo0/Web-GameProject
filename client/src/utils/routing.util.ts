import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { GameEvents } from '@gametypes/event.types';
import type { SceneKeys } from '@gametypes/scene.types';

export function subSceneChange<T extends CoreScene>(this: T, button: HTMLButtonElement, to: SceneKeys) {
	button.addEventListener('click', () => {
		this.game.events.emit(GameEvents.SUB_SCENE_CHANGE, this.sceneKey, to);
	});
}
