import { AbstractBaseScene } from '@abstracts/scene-base/AbstractBaseScene';
import { MAIN_DIV_STYLE } from '@config/render.config';

export abstract class BaseHtmlScene extends AbstractBaseScene {
	public div!: HTMLElement;

	//#region WithPhaserCycle Implementation
	public prepareAssets(): void {
		this.onPreload();
	}

	public setupScene(): void {
		this.div = this.add
			.dom(0, 0)
			.createFromCache(this.sceneKey)
			.setOrigin(0, 0).node.firstElementChild as HTMLElement; // firstElementChild -> наш главынй контенер из <имя>.html файла
		this.div.setAttribute('style', MAIN_DIV_STYLE);
		this.div.id = `${this.sceneKey}`;
		this.onCreate();
	}

	public update(): void {
		this.heartbeat();
	}

	public shutdown(): void {
		this.onShutdown();
		this.div.remove();
	}
	//#endregion
}
