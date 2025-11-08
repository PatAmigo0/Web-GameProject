// src/config/interaction.config.ts
import { SceneKeys } from '@gametypes/scene.types'; // ← Только SceneKeys отсюда

// InteractionConfig объявляем прямо здесь, так как это конфиг файл
export interface InteractionConfig {
	key: string;
	x: number;
	y: number;
	width: number;
	height: number;
	minigame: SceneKeys;
	promptText: string;
}

export const INTERACTION_CONFIG = {
	ZONES: {
		TEST_ZONE: {
			key: 'test_zone',
			x: 400,
			y: 300,
			width: 100,
			height: 100,
			minigame: SceneKeys.TestMinigame,
			promptText: 'Тест взаимодействия [E]',
		},
	},
} as const;
