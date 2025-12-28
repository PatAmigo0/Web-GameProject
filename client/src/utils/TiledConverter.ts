import Phaser from 'phaser';

/**
 * Утилита для преобразования координат между системами Tiled и Phaser
 * Tiled использует (0,0) в левом верхнем углу для объектов
 * Phaser использует (0.5, 0.5) (центр) по умолчанию для спрайтов
 */
export class TiledConverter {
	/**
	 * Преобразует координаты объекта из Tiled в координаты центра спрайта в Phaser
	 * @param tiledObject Объект из Tiled с x, y, width, height
	 * @returns Объект с { x, y } для использования в Phaser
	 */
	public static tiledObjectToPhaserCenter(tiledObject: Phaser.Types.Tilemaps.TiledObject): {
		x: number;
		y: number;
	} {
		if (!tiledObject || tiledObject.x === undefined || tiledObject.y === undefined) {
			console.warn('[TiledConverter] Передан некорректный объект Tiled. Возвращены нулевые координаты');
			return { x: 0, y: 0 };
		}
		return {
			x: tiledObject.x + (tiledObject.width || 0) / 2,
			y: tiledObject.y + (tiledObject.height || 0) / 2,
		};
	}
}
