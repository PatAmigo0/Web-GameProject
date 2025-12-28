import { CoreScene } from '@abstracts/scene-base/CoreScene';
import { type ISceneHandlers } from '@gametypes/scene.types';

export function sceneDefiner(scene: CoreScene, SceneHandlers: ISceneHandlers) {
	const f = SceneHandlers[scene.sceneType];
	if (f) {
		f();
	} else {
		console.warn(
			`[ SceneDefiner ] не нашел обработчик для типа сцены ${scene.sceneType}`,
		);
	}
}
