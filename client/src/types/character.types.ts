// src/types/character.types.ts

export type CharacterEvent = {
	readonly HEALTH_CHANGED: unique symbol;
	readonly DIED: unique symbol;
};
