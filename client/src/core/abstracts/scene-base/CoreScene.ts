// src/game/utils/ABC/CoreScene.ts
import { SceneEvents } from '@gametypes/event.types';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import type { GameService } from '@services/GameService';
import Phaser from 'phaser';

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
	/** Уникальный ключ сцены из `SceneKeys` */
	public sceneKey!: SceneKeys;
	/** Тип сцены (GameScene, MenuScene и т.д.) из `SceneTypes` */
	public sceneType!: SceneTypes;

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

	/**
	 * @param sceneKey Ключ этой сцены из `SceneKeys`
	 * @param sceneType [Optional] Тип этой сцены из `SceneTypes` (По умолчанию: `Undefined`)
	 */
	constructor(sceneKey: SceneKeys, sceneType: SceneTypes = SceneTypes.Undefined) {
		super(sceneKey);
		this.sceneKey = sceneKey;
		if (sceneType == SceneTypes.Undefined)
			console.warn('[ WARNING ] У сцены не определен стиль, это очень плохо');
		this.sceneType = sceneType;
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
		this.events.emit(SceneEvents.SCENE_IS_READY_TO_RUN);
	}
}
