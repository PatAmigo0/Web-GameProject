// src/game/types/tiled.config.ts

//#region LAYER NAMES & TYPES
/**
 * Имена слоев объектов в Tiled
 */
export const OBJECT_SPAWNS_LAYER = 'spawns';
export const OBJECT_DECORATIONS_LAYER = 'decorations';
export const OBJECT_LAYER_LISTENERS_NAME = 'listeners';
//#endregion

//#region TILE PROPERTIES (Layer Custom Properties)
/**
 * Имена пользовательских свойств слоев (Layer Custom Properties)
 */
export const LAYER_PROPERTIE_COLLIDES = 'collides';
export const LAYER_COLLIDES_DECORATION_TYPE = 'collides_decorations';
export const DEPTH_PROPERTIE_NAME = 'depth';
//#endregion

//#region OBJECT NAMES & TYPES
/**
 * Имена объектов и типы, используемые для поиска на карте
 */
export const PLAYER_SPAWN = 'PlayerSpawn';
export const OBJECT_FADING_LISTENER_TYPE = 'FadingListener';
//#endregion
