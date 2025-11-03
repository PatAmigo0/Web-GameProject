import { withAppLifecycle } from './CommonSceneWrapper';
import { withPhaserLifecycle } from './WithPhaserLifecycle';
import { TypedScene } from './TypedScene';

export abstract class AbstractBaseScene extends withAppLifecycle(
	withPhaserLifecycle(TypedScene),
) {}
