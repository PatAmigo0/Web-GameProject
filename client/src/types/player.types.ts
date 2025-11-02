// src/types/player.types.ts

//#region DIRECTION TYPES
/**
 * Типы для обозначения направления движения игрока
 * Использует unique symbol для гарантированной уникальности и предотвращения коллизий
 */
export type Direction = {
	readonly NORTH: unique symbol;
	readonly SOUTH: unique symbol;
	readonly EAST: unique symbol;
	readonly WEST: unique symbol;
};
//#endregion

//#region PLAYER EVENT TYPES
/**
 * Типы событий, связанных с состоянием игрока
 * Используется в EventService
 */
export type PlayerEvent = {
	readonly HEALTH_CHANGED: unique symbol;
	readonly DIED: unique symbol;
};
//#endregion
