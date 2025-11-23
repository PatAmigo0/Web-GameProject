import { AbstractBaseScene } from '@abstracts/scene-base/AbstractBaseScene';
import { MAIN_DIV_STYLE } from '@config/render.config';

export abstract class BaseHtmlScene extends AbstractBaseScene {
	public div!: HTMLElement;

	//#region WithPhaserCycle Implementation
	public prepareAssets(): void {
		this.onPreload();
	}

	public setupScene(): void {
		const rawHtml = this.cache.html.get(this.sceneKey);
		const wrappedHtml = `<div style=${MAIN_DIV_STYLE}, id=${this.sceneKey}>${rawHtml}</div>`;
		this.div = this.add.dom(0, 0).setOrigin(0, 0).createFromHTML(wrappedHtml).node
			.firstElementChild as HTMLElement;
		this.onCreate();
	}

	public update(): void {
		this.heartbeat();
	}

	public closeScene(): void {
		this.onShutdown(); // <class extends BaseHtmlScene>.shutdown()
		this.div.remove();
	}
	//#endregion
}
