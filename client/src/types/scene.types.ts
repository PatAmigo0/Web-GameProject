// src/types/scene.types.ts

//#region SCENE KEYS
/**
 * Уникальные ключи для идентификации сцен Phaser
 * Используются для запуска, остановки и получения сцен
 */
export enum SceneKeys {
	BootScene = 'BootScene', // Сцена начальной загрузки
	MainMenu = 'MainMenu', // Главное меню
	TestPlace = 'TestPlace', // Основная игровая сцена (тестовая)
	CharacterTestPlace = 'CharacterTestPlace',
	Lobby = 'Lobby',
}
//#endregion

//#region SCENE TYPES
/**
 * Категории или типы сцен
 * Используются для внутренней архитектуры и управления сценами
 */
export enum SceneTypes {
	GameScene = 'GAME', // Основные игровые сцены (уровни, миры)
	UIScene = 'UI', // Сцены пользовательского интерфейса (инвентарь, HUD)
	HTMLScene = 'HTML',
	SystemScene = 'SYS', // Системные сцены (загрузка ассетов, переходы)
	Undefined = 'UNDEFINED', // Тип по умолчанию / Неопределенная сцена
}
//#endregion

export type ISceneHandlers = {
	[key in SceneTypes]?: Function;
};
