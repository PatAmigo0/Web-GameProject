// src/game/utils/ABC/CoreScene.ts
import { Logger } from '@components/shared/LoggerComponent';
import { SceneEvents, type IEventable } from '@gametypes/event.types';
import { SceneKeys, SceneTypes, type SceneConfig } from '@gametypes/scene.types';
import type { GameService } from '@services/GameService';
import Phaser from 'phaser';

type baseListenableConfig = {
	element: IEventable;
	event: string;
	callback: (...args: any[]) => any;
};

/**
 * **Корневой** абстрактный класс для **всех** сцен в проекте.
 *
 * Это ЕДИНСТВЕННЫЙ класс в проекте, который должен напрямую наследовать `Phaser.Scene`.
 * Все остальные базовые сцены (`AbstractBaseScene`, `BaseGameScene` и т.д.)
 * должны в конечном итоге наследоваться от него.
 *
 * ---
 *
 * ### Ключевые задачи:
 * 1.  **Типизация `this.game`**: "Пробрасывает" тип кастомного `GameService`
 * в `this.game`, давая всем сценам доступ к сервисам (e.g., `assetManager`).
 * 2.  **Идентификация Сцены**: Требует `sceneKey` и `sceneType` при создании.
 * 3.  **Автоматизация `preload`**: Стандартизирует загрузку ассетов через `AssetManager`.
 * 4.  **Автоматизация `create`**: Стандартизирует событие о готовности сцены.
 *
 * @abstract
 */
export abstract class CoreScene extends Phaser.Scene {
	/**
	 * [!] **ВАЖНОЕ ПЕРЕОПРЕДЕЛЕНИЕ ТИПА**
	 *
	 * Обеспечивает строгую типизацию `this.game` как `GameService`
	 *
	 * Это дает всем дочерним сценам
	 * прямой и типобезопасный доступ ко всем глобальным сервисам
	 * (e.g., `this.game.assetManager`, `this.game.userInputService`).
	 */
	declare game: GameService;
	protected logger!: Logger;
	private __events = new Array<baseListenableConfig>();

	/**
	 * @param sceneKey Ключ этой сцены из `SceneKeys`
	 * @param sceneType [Optional] Тип этой сцены из `SceneTypes` (По умолчанию: `Undefined`)
	 */
	constructor(
		public sceneKey: SceneKeys,
		public sceneType: Set<SceneTypes> = new Set([SceneTypes.Undefined]),
		public config?: SceneConfig,
		private __launchedScenes = new Set<CoreScene>(),
	) {
		super(sceneKey);
		this.logger = new Logger(this.sceneKey);
	}

	/**
	 * Базовая реализация `preload`.
	 *
	 * Автоматически вызывает `AssetManager` для загрузки ассетов,
	 * определенных в манифесте для этой конкретной сцены
	 *
	 * [!] **ПРАВИЛО НАСЛЕДОВАНИЯ:**
	 * При переопределении в дочерних классах (e.g., `AbstractBaseScene`)
	 * **обязательно** вызывайте `super.preload()` в **начале** метода
	 *
	 * @override
	 */
	public preload(): void {
		this.game.assetManager.loadAssets(this);
	}

	/**
	 * Базовая реализация `create`.
	 *
	 * Испускает событие `SceneEvents.SCENE_IS_READY_TO_RUN`,
	 * сигнализируя системе (например, `TransitionManager`),
	 * что сцена полностью создана и готова к показу
	 *
	 * [!] **ПРАВИЛО НАСЛЕДОВАНИЯ:**
	 * При переопределении в дочерних классах (e.g., `AbstractBaseScene`)
	 * **обязательно** вызывайте `super.create()` в **конце** метода
	 *
	 * @override
	 */
	public create(): void {
		this.events.emit(SceneEvents.SCENE_IS_READY_TO_RUN, this);
	}

	/**
	 * Базовая реализация `shutdown`
	 *
	 * Останавливает все сцены, запущенные через `this.launchLinked(...)`
	 *
	 * [!] **ПРАВИЛО НАСЛЕДОВАНИЯ:**
	 * При переопределении в дочерних классах (e.g., `AbstractBaseScene`)
	 * **обязательно** вызывайте `super.shutdown()` в **начале** метода
	 */
	public shutdown(): void {
		this.__events.forEach((v) => {
			v.element.removeEventListener(v.event, v.callback);
		});
		this.__launchedScenes.forEach((scene) => {
			this.game.scene.stop(scene);
		});
		this.__launchedScenes.clear();
	}

	public wake(): void {
		this.events.emit(SceneEvents.SCENE_IS_READY_TO_RUN, this);
	}

	/**
	 * Запускает сцену в паралельном режиме с текущей сценой
	 *
	 * [!] **Обязательно** будет удалено при остановке родительской сцены (той, что запустила через этот метод)
	 *
	 * @param key Ключ сцены / сама сцена
	 * @param data Дополнительные данные для сцены (опционально)
	 */
	public launchLinked<T extends CoreScene>(key: string | T, data?: object) {
		const scene = this.scene.get(key);
		if (this.scene.isSleeping(scene)) {
			this.game.scene.wake(scene, data);
		} else {
			this.__launchedScenes.add(scene);
			this.scene.launch(scene, data);
		}
	}

	/**
	 * Останавливает паралельную сцену
	 * @param key Ключ сцены или сама сцена
	 */
	public stopLinked<T extends CoreScene>(key: string | T) {
		const scene = this.scene.get(key);
		if (this.__launchedScenes.has(scene)) {
			this.__launchedScenes.delete(scene);
			this.game.scene.stop(key);
		}
	}

	public sleepLinked<T extends CoreScene>(key: string | T) {
		const scene = this.scene.get(key);
		if (this.__launchedScenes.has(scene)) {
			this.game.scene.sleep(key);
		}
	}

	protected listenEvent(
		config: baseListenableConfig & {
			method?: 'addEventListener' | 'on';
		},
	) {
		const element = config.element;
		let method = config.method ?? 'addEventListener';
		if (!element[method]) return;

		element[method](config.event, (...args: any) => config.callback(args));
		this.__events.push(config);
	}
}
