import { CoreScene } from '@abstracts/scene/CoreScene';
import { withAppLifecycle } from '@abstracts/scene/WithAppLifecycle';
import { withPhaserLifecycle } from '@abstracts/scene/WithPhaserLifecycle';

export abstract class AbstractBaseScene extends withAppLifecycle(
	withPhaserLifecycle(CoreScene),
) {
	abstract prepareAssets(): void;
	abstract setupScene(): void;

	public preload(): void {
		super.preload();
		this.prepareAssets();
	}

	public create(): void {
		this.setupScene();
		super.create();
	}
}
