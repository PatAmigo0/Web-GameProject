// src/types/scene.types.ts

//#region SCENE KEYS
export enum SceneKeys {
	BootScene = 'BootScene',
	LoginScene = 'Login',
	SignupScene = 'Signup',
	MainMenu = 'MainMenu',
	TestPlace = 'TestPlace',
	CharacterTestPlace = 'CharacterTestPlace',
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
