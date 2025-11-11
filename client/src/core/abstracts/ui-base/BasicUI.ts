//#region IMPORTS
import { MAX_DEPTH } from '@config/render.config';
import { CoordinatesConverter } from '@utils/CoordinatesConverter';
//#endregion

//#region CLASS DEFINITION
export abstract class BasicUI extends Phaser.GameObjects.Container {
	//#region CLASS ATTRIBUTES
	public realVector!: Phaser.Math.Vector2; // Координаты, независимые от масштабирования
	//#endregion

	//#region CONSTRUCTOR
	constructor(scene: Phaser.Scene, x: number, y: number) {
		// 1. Конвертируем "реальные" координаты в экранные (с учетом масштаба)
		const vector = CoordinatesConverter.convertXY(scene, x, y);

		// 2. Вызываем конструктор родителя с конвертированными координатами
		super(scene, vector.x, vector.y);

		// 3. Сохраняем и устанавливаем позиции
		this.x = vector.x;
		this.y = vector.y;
		this.realVector = new Phaser.Math.Vector2(x, y);

		// 4. Настройка контейнера UI
		this.setVisible(false); // По умолчанию скрыт
		this.setScrollFactor(0); // Фиксируем на экране (не двигается с камерой)
		this.setDepth(MAX_DEPTH + 1); // Всегда поверх всего

		// 5. Добавляем на сцену
		this.scene.add.existing(this);
		this.setPosition(this.x, this.y);
	}
	//#endregion

	//#region ABSTRACT & CORE METHODS
	/**
	 * Метод для инициализации содержимого UI (должен быть реализован в дочерних классах).
	 */
	abstract init(): void;

	/**
	 * Абстрактный метод для отображения UI (должен быть реализован в дочерних классах).
	 */
	public abstract show(...args: any[]): void;

	/**
	 * Основной метод для скрытия UI.
	 */
	public hide(...args: any[]): void {
		args;
		this.setVisible(false);
	}
	//#endregion
}
//#endregion
