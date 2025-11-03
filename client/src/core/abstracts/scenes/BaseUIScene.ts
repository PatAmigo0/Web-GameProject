import { AssetManager } from '@services/AssetManager';
import { AbstractBaseScene } from '@abstracts/scenes/AbstractBaseScene';

export abstract class BaseUIScene extends AbstractBaseScene {
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
		document.head.removeChild(this.link);
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
