import { CharacterTestPlace } from './game/CharacterTestPlace';
import { LoginScene } from './html/Login';
import { CreateRoomScene } from './html/menuGroup/CreateRoom';
import { MainMenuScene } from './html/menuGroup/MainMenu';
import { MenuWrapperScene } from './html/menuGroup/MenuWrapper';
import { ServerListScene } from './html/menuGroup/ServerList';
import { RegistrationScene } from './html/Registration';
import { BootScene } from './system-scenes/BootScene';
import { ServerOfflineScene } from './system-scenes/ServerOffline';

export const scenes = [
	BootScene, // [!] ВСЕГДА ДОЛЖНО БЫТЬ ПЕРВОЙ В ЭТОМ СПИСКЕ

	ServerOfflineScene,
	LoginScene,
	RegistrationScene,
	MainMenuScene,
	ServerListScene,
	CreateRoomScene,
	CharacterTestPlace,
	MenuWrapperScene,
];
