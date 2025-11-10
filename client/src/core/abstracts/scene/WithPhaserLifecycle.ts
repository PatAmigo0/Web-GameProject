import { CoreScene } from '@abstracts/scene/CoreScene';

export function withPhaserLifecycle<
	T extends abstract new (...args: any[]) => {},
>(Base: T) {
	abstract class CommonTypedWrappedAbstraction extends Base {
		declare events: Phaser.Events.EventEmitter;

		abstract preload(): void;
		abstract create(): void;
		abstract update(time?: number, delta?: number): void;
		abstract shutdown(): void;
	}

	return CommonTypedWrappedAbstraction;
}

export abstract class WithPhaserLifecycle extends withPhaserLifecycle(
	CoreScene,
) {}
