// src/types/scene.types.ts

//#region SCENE KEYS
export enum SceneKeys {
	BootScene = 'BootScene',
	OfflineScene = 'OfflineScene',
	LoginScene = 'Login',
	SignupScene = 'Signup',
	MainMenu = 'MainMenu',
	ServerList = 'ServerList',
	TestPlace = 'TestPlace',
	CharacterTestPlace = 'CharacterTestPlace',
	MenuWrapper = 'MenuWrapper',
}
//#endregion

//#region SCENE TYPES
export enum SceneTypes {
	GameScene = 'GAME',
	UIScene = 'UI',
	HTMLScene = 'HTML',
	SystemScene = 'SYS',
	Undefined = 'UNDEFINED',
}
//#endregion

export type ISceneHandlers = {
	[key in SceneTypes]?: Function;
};

export type SceneConfigDecorator = {
	to?: SceneKeys | SceneKeys[];
};

export type SceneConfig = {
	to?: Set<SceneKeys>;
};
