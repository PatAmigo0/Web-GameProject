import type { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { injectLogger } from '@decorators/injectLogger.decorator';
import type { BaseFunction } from '@gametypes/core.types';
import type { Logger } from '@utils/Logger.util';

@injectLogger()
export class StyleManager {
	protected declare logger: Logger;

	private eventListenerOptions: AddEventListenerOptions = {
		once: true,
	};

	public preloadStyle(scene: BaseHtmlScene, url: string): void {
		const link: HTMLLinkElement = this.createLink(scene.sceneKey, url);

		this.loadLink(scene, link);
		scene.events.once('shutdown', () => {
			link.remove();
		});
	}

	private createLink(cacheKey: string, url: string): HTMLLinkElement {
		const link = document.createElement('link');
		link.disabled = true;
		link.rel = 'stylesheet';
		link.href = url;
		link.id = `css-for-${cacheKey}`;

		return link;
	}

	private loadLink(scene: CoreScene, link: HTMLLinkElement): void {
		scene.load.rexAwait((success) => {
			document.head.append(link);
			this.listenForLinkEvents(link, success);
			link.disabled = false;
		});
	}

	private listenForLinkEvents(link: HTMLLinkElement, success: BaseFunction): void {
		link.addEventListener(
			'load',
			() => {
				this.logger.debug(`link ${link.id} успешно загрузился`);
				success();
			},
			this.eventListenerOptions,
		);

		link.addEventListener(
			'error',
			() => {
				this.logger.warn(`link ${link.id} НЕ загрузился (404?)`);
				success();
			},
			this.eventListenerOptions,
		);
	}
}
