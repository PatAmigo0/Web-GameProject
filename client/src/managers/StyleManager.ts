import type { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import type { CoreScene } from '@abstracts/scene-base/CoreScene';
import { CacheComponent } from '@components/shared/CacheComponent';
import type { BaseFunction } from '@gametypes/core.types';

export class StyleManager {
	private styleCache = new CacheComponent();
	private eventListenerOptions: AddEventListenerOptions = {
		once: true,
	};

	public preloadStyle(scene: BaseHtmlScene, url: string): void {
		if (!this.styleCache.exists(scene.sceneKey)) {
			this.createLink(scene.sceneKey, url);
		}
		const link = this.loadLink(scene);

		scene.events.once('shutdown', () => {
			link.disabled = true;
		});
	}

	private createLink(cacheKey: string, url: string): void {
		const link = document.createElement('link');
		link.disabled = true;
		link.rel = 'stylesheet';
		link.href = url;
		link.id = `css-for-${cacheKey}`;
		this.styleCache.add(cacheKey, link);
		document.head.append(link);
	}

	private loadLink(scene: CoreScene): HTMLLinkElement {
		const link = this.styleCache.get(scene.sceneKey) as HTMLLinkElement;
		scene.load.rexAwait((success) => {
			this.listenForLinkEvents(link, success);
		});
		link.disabled = false; // загружаем
		return link;
	}

	private listenForLinkEvents(
		link: HTMLLinkElement,
		success: BaseFunction,
	): void {
		link.addEventListener(
			'load',
			() => {
				console.debug(
					`[StyleManager] link ${link.id} успешно загрузился`,
				);
				success();
			},
			this.eventListenerOptions,
		);
	}
}
