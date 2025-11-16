// SceneInfo.decorator.ts

import type { BaseClass } from '@gametypes/core.types';
import type { SceneConfig, SceneConfigDecorator, SceneKeys } from '@gametypes/scene.types';
import { copyClassMetadata } from '@utils/copyClassMetadata.util';

export function SceneInfo(sceneKey: string, sceneType: string, config?: SceneConfigDecorator) {
	return function <T extends BaseClass>(constructor: T) {
		return copyClassMetadata(
			constructor,
			class extends constructor {
				constructor(...args: any[]) {
					let normalizedConfig: SceneConfig = undefined;

					if (config) {
						normalizedConfig = {};
						Object.assign(normalizedConfig, config);

						if (config?.to) {
							normalizedConfig.to = new Set<SceneKeys>(
								Array.isArray(config.to) ? config.to : [config.to],
							);
						}
					}

					super(sceneKey, sceneType, normalizedConfig, ...args);
				}
			},
		);
	};
}
