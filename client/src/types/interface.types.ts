import type { AnimatorComponent } from '@components/entities/playerComponents/AnimatorComponent';
import type { InputComponent } from '@components/entities/playerComponents/InputComponent';
import type { GameService } from '@services/GameService';

export interface IMapAssetManifest {
	mapJsonUrl: string;
	tilesetUrls: string[];
}

export interface IHtmlAssetManifest {
	CSS: string;
	HTML: string;
}

export interface IInitializiable {
	init: () => void;
}

export interface IInputable {
	keyinput: InputComponent;
}

export interface IAnimatable {
	animator: AnimatorComponent;
}

export interface IGameContextAware {
	game: GameService;
}
