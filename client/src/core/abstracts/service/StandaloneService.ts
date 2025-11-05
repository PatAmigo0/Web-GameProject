import type { IInitializiable } from '@gametypes/interface.types';

export abstract class StandaloneService
	extends Phaser.Events.EventEmitter
	implements IInitializiable
{
	abstract init(): void;
}
