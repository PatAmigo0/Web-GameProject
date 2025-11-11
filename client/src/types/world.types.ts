// src/types/world.types.ts

export interface IPropertie {
	name: string;
	type: string;
	value: any;
}

export interface IBooleanPropertie extends Omit<IPropertie, 'value'> {
	value: boolean;
}
