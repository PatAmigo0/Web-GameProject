import { CoreScene } from '@abstracts/scene-base/CoreScene';

export function withAppLifecycle<T extends abstract new (...args: any[]) => {}>(Base: T) {
	abstract class CommonTypedWrappedAbstraction extends Base {
		// функции второго слоя (вызываются функциями высшего слоя)
		public abstract onPreload(): void;
		public abstract onCreate(): void;
		public abstract heartbeat(time?: number, delta?: number): void;
		public abstract onShutdown(): void;
	}

	return CommonTypedWrappedAbstraction;
}

export abstract class CommonAbstractWrapper extends withAppLifecycle(CoreScene) {}
