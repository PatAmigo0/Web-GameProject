// src/game/types/layer.types.ts

export const enum ObjectLayerKeys {
	Spawn = 'spawn',
}

export interface Propertie {
	name: string;
	type: string;
	value: any;
}

export interface BooleanPropertie extends Omit<Propertie, 'value'> {
	value: boolean;
}
