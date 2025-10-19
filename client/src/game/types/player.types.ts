// src/game/types/player.types.ts

export type Direction = {
	readonly NORTH: unique symbol;
	readonly SOUTH: unique symbol;
	readonly EAST: unique symbol;
	readonly WEST: unique symbol;
};

export type PlayerEvent = {
	readonly HEALTH_CHANGED: unique symbol;
	readonly DIED: unique symbol;
};
