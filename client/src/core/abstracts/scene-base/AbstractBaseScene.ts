import { CoreScene } from '@abstracts/scene-base/CoreScene';
import { withAppLifecycle } from '@abstracts/scene-base/WithAppLifecycle';
import { withPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';

/**
 * [!] Архитектурный класс-шаблон (Мета-шаблон).
 *
 * Этот класс НЕ предназначен для прямого наследования игровыми сценами
 * (такими как `MainScene` или `TestScene`).
 *
 * Его **единственная** цель — служить "шаблоном для создания шаблонов"
 * (например, для `BaseGameScene` или `BaseMenuScene`).
 *
 * ---
 *
 * ### [?] Что он делает?
 *
 * Он реализует паттерн "Template Method" для базового жизненного цикла Phaser:
 *
 * 1.  **Перехватывает** нативный `preload()` -> и вызывает `abstract prepareAssets()`
 * 2.  **Перехватывает** нативный `create()` -> и вызывает `abstract setupScene()`
 *
 * Дочерний класс (например, `BaseGameScene`) **обязан** реализовать
 * `prepareAssets()` и `setupScene()`, чтобы предоставить *общую*
 * логику для *своих* дочерних сцен.
 */
export abstract class AbstractBaseScene extends withAppLifecycle(withPhaserLifecycle(CoreScene)) {
	/**
	 * Абстрактный "шаг" для загрузки ассетов.
	 *
	 * Этот метод вызывается *внутри* `preload()`
	 *
	 * Дочерний класс (например, `BaseGameScene`) должен реализовать этот
	 * метод и предоставить общую логику загрузки.
	 *
	 * @abstract
	 */
	public abstract prepareAssets(): void;

	/**
	 * Абстрактный "шаг" для настройки сцены.
	 *
	 * Этот метод вызывается *внутри* `create()`
	 *
	 * Дочерний класс (например, `BaseGameScene`) должен реализовать этот
	 * метод и предоставить общую логику создания объектов.
	 *
	 * @abstract
	 */
	public abstract setupScene(): void;

	/**
	 * Закрывает сцену
	 */
	public abstract closeScene(): void;

	/**
	 * [!] **НЕ ИСПОЛЬЗОВАТЬ В ДОЧЕРНИХ КЛАССАХ.**
	 *
	 * Реализует `prepareAssets()` как обязательный шаг жизненного цикла `preload`.
	 *
	 * @internal
	 * @override
	 */
	public preload(): void {
		super.preload();
		this.prepareAssets();
	}

	/**
	 * [!] **НЕ ИСПОЛЬЗОВАТЬ В ДОЧЕРНИХ КЛАССАХ.**
	 *
	 * Реализует `setupScene()` как обязательный шаг жизненного цикла `create`.
	 *
	 * @internal
	 * @override
	 */
	public create(): void {
		this.setupScene();
		super.create();
	}

	/**
	 * [!] **НЕ ИСПОЛЬЗОВАТЬ В ДОЧЕРНИХ КЛАССАХ.**
	 *
	 * Вызывает closeScene у дочернего класса
	 */
	public shutdown(): void {
		super.shutdown();
		this.closeScene();
	}
}
