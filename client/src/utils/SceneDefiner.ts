import { TypedScene } from '@abstracts/scenes/TypedScene';
import { type ISceneHandlers } from '@gametypes/scene.types';

export function sceneDefiner(scene: TypedScene, SceneHandlers: ISceneHandlers) {
	const f = SceneHandlers[scene.sceneType];
	if (f) {
		f();
	} else {
		console.warn(
			`[ SceneDefiner ] не нашел обработчик для типа сцены ${scene.sceneType}`,
		);
	}
}
