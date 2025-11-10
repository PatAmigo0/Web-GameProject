import { AbstractBaseScene } from '@abstracts/scene/AbstractBaseScene';
import { MAIN_DIV_STYLE } from '@config/game.config';

export abstract class BaseHtmlScene extends AbstractBaseScene {
	public div!: HTMLElement;
	private link!: HTMLLinkElement;

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
		this.onCreate();
	}

	public update(): void {
		this.heartbeat();
	}

	public shutdown(): void {
		this.onShutdown();
		this.div.remove();
		if (this.link) this.link.disabled = true;
		else console.warn(`[BaseHtmlScene] link не существует`);
	}

	public setLink(link: HTMLLinkElement) {
		this.link = link;
	}

	//#endregion
}
