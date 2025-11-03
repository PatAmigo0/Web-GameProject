// src/types/layer.types.ts

//#region LAYER KEYS
/**
 * Ключи для объектных слоев, используемых для поиска конкретных групп объектов
 */
export const ObjectLayerKeys = {
	Spawn: 'spawn', // Слой, содержащий точки спавна
} as const;
//#endregion

//#region TILE & LAYER PROPERTIES INTERFACES
/**
 * Базовый интерфейс для свойства Tiled (кастомное свойство)
 */
export interface IPropertie {
	name: string; // Имя свойства, например 'collides' или 'depth'
	type: string; // Тип данных свойства, например 'boolean', 'int', 'string'
	value: any; // Фактическое значение
}

/**
 * Интерфейс для свойства Tiled, значение которого гарантированно является boolean
 * Расширяет Propertie, переопределяя тип valueы
 */
export interface IBooleanPropertie extends Omit<IPropertie, 'value'> {
	value: boolean;
}
//#endregion
