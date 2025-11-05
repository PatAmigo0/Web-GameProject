import { TypedScene } from '@abstracts/scene/TypedScene';

export function withPhaserLifecycle<
	T extends abstract new (...args: any[]) => {},
>(Base: T) {
	abstract class CommonTypedWrappedAbstraction extends Base {
		abstract preload(): void;
		abstract create(): void;
		abstract update(time?: number, delta?: number): void;
		abstract shutdown(): void;
	}

	return CommonTypedWrappedAbstraction;
}

export abstract class WithPhaserLifecycle extends withPhaserLifecycle(
	TypedScene,
) {}
