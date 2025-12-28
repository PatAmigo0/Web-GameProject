import { CoreScene } from '@abstracts/scene-base/CoreScene';

export function withAppLifecycle<T extends abstract new (...args: any[]) => {}>(
	Base: T,
) {
	abstract class CommonTypedWrappedAbstraction extends Base {
		abstract onPreload(): void;
		abstract onCreate(): void;
		abstract heartbeat(time?: number, delta?: number): void;
		abstract onShutdown(): void;
	}

	return CommonTypedWrappedAbstraction;
}

export abstract class CommonAbstractWrapper extends withAppLifecycle(
	CoreScene,
) {}
