import { withAppLifecycle } from '@abstracts/scenes/CommonSceneWrapper';
import { TypedScene } from '@abstracts/scenes/TypedScene';
import { withPhaserLifecycle } from '@abstracts/scenes/WithPhaserLifecycle';

export abstract class AbstractBaseScene extends withAppLifecycle(
	withPhaserLifecycle(TypedScene),
) {}
