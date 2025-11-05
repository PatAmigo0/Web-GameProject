import { withAppLifecycle } from '@abstracts/scene/CommonSceneWrapper';
import { TypedScene } from '@abstracts/scene/TypedScene';
import { withPhaserLifecycle } from '@abstracts/scene/WithPhaserLifecycle';

export abstract class AbstractBaseScene extends withAppLifecycle(
	withPhaserLifecycle(TypedScene),
) {}
