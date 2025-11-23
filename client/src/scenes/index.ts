import { CharacterTestPlace } from './game/CharacterTestPlace';
import { LoginScene } from './html/Login';
import { MainMenuScene } from './html/MainMenu';
import { MenuWrapperScene } from './html/MenuWrapper';
import { RegistrationScene } from './html/Registration';
import { ServerListScene } from './html/ServerList';
import { BootScene } from './system-scenes/BootScene';
import { ServerOfflineScene } from './system-scenes/ServerOffline';

export const scenes = [
	BootScene,
	ServerOfflineScene,
	LoginScene,
	RegistrationScene,
	MainMenuScene,
	ServerListScene,
	CharacterTestPlace,
	MenuWrapperScene,
];
