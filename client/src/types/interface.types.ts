import type { AnimatorComponent } from '@components/entities/playerComponents/AnimatorComponent';
import type { InputComponent } from '@components/entities/playerComponents/InputComponent';

export interface IMapAssetManifest {
	mapJsonUrl: string;
	tilesetUrls: string[];
}

export interface IHtmlAssetManifest {
	CSS: string;
	HTML: string;
}

export interface IInitializiable {
	init: Function;
}

export interface IInputable {
	keyinput: InputComponent;
}

export interface IAnimatable {
	animator: AnimatorComponent;
}
