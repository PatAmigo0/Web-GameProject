import { CoreScene } from '@abstracts/scene-base/CoreScene';

export function withPhaserLifecycle<T extends abstract new (...args: any[]) => {}>(Base: T) {
	abstract class CommonTypedWrappedAbstraction extends Base {
		declare events: Phaser.Events.EventEmitter;

		// функции верхнего слоя
		public abstract preload(): void;
		public abstract create(): void;
		public abstract update(time?: number, delta?: number): void;
		public abstract shutdown(): void;
	}

	return CommonTypedWrappedAbstraction;
}

export abstract class WithPhaserLifecycle extends withPhaserLifecycle(CoreScene) {}
