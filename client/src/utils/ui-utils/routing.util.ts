import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { GameEvents } from '@gametypes/event.types';
import type { SceneKeys } from '@gametypes/scene.types';

export function listenSubSceneChange<T extends CoreScene>(this: T, button: HTMLButtonElement, to: SceneKeys) {
	this.listenEvent({
		element: button,
		event: 'click',
		callback: () => {
			this.game.events.emit(GameEvents.SUB_SCENE_CHANGE, this.sceneKey, to);
		},
	});
}
