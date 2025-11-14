import type { IInitializiable } from '@gametypes/core.types';

export abstract class StandaloneService extends Phaser.Events.EventEmitter implements IInitializiable {
	abstract init(...args: any[]): any;
}
