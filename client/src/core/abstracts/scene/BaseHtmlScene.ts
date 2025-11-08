import { AssetManager } from '@/managers/AssetManager';
import { AbstractBaseScene } from '@abstracts/scene/AbstractBaseScene';
import { MAIN_DIV_STYLE } from '@config/game.config';

export abstract class BaseHtmlScene extends AbstractBaseScene {
	public div!: HTMLElement;
	private link!: HTMLLinkElement;

	//#region WithPhaserCycle Implementation
	public preload(): void {
		AssetManager.loadAssets(this);
		this.onPreload();
	}

	public create(): void {
		this.div = this.add
			.dom(0, 0)
			.createFromCache(this.sceneKey)
			.setOrigin(0, 0).node.firstElementChild as HTMLElement; // firstElementChild -> наш главынй контенер из <имя>.html файла
		this.div.setAttribute('style', MAIN_DIV_STYLE);
		this.onCreate();
	}

	public update(): void {
		this.heartbeat();
	}

	public shutdown(): void {
		this.onShutdown();
		this.div.remove();
		if (this.link) document.head.removeChild(this.link);
		else console.warn(`[BaseHtmlScene] link не существует`);
	}
	//#endregion

	//#region Extra methods
	public loadCSS(url: string): void {
		this.link = document.createElement('link');
		this.link.rel = 'stylesheet';
		this.link.href = url;
		this.link.id = `css-for-${this.sceneKey}`;
		document.head.append(this.link);
	}
	//#endregion
}
