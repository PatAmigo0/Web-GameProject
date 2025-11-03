import { withAppLifecycle } from '@abstracts/scenes/CommonSceneWrapper';
import { withPhaserLifecycle } from '@abstracts/scenes/WithPhaserLifecycle';
import { TypedScene } from '@abstracts/scenes/TypedScene';

export abstract class AbstractBaseScene extends withAppLifecycle(
	withPhaserLifecycle(TypedScene),
) {}
