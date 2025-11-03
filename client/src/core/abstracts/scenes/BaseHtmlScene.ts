import { AbstractBaseScene } from '@abstracts/scenes/AbstractBaseScene';
import { AssetManager } from '@services/AssetManager';

export abstract class BaseHtmlScene extends AbstractBaseScene {
	public div!: Phaser.GameObjects.DOMElement;
	private link!: HTMLLinkElement;

	//#region WithPhaserCycle Implementation
	public preload(): void {
		AssetManager.loadAssets(this);
		this.onPreload();
	}

	public create(): void {
		this.div = this.add
			.dom(this.cameras.main.centerX, this.cameras.main.centerY)
			.createFromCache(this.sceneKey);
		this.onCreate();
	}

	public update(): void {
		this.heartbeat();
	}

	public shutdown(): void {
		this.onShutdown();
		this.div.destroy();
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
