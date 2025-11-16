import { BaseGameScene } from '@abstracts/scene-base/BaseGameScene';
import { Character } from '@components/entities/Character';
import { ASSET_KEYS, ASSET_URLS } from '@config/assets.config';
import { CHARACTER_SPRITESHEET_CONFIG } from '@config/render.config';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.CharacterTestPlace, SceneTypes.GameScene, { to: [SceneKeys.MainMenu] })
export class CharacterTestPlace extends BaseGameScene {
	private char: Character;

	onPreload(): void {
		this.load.spritesheet(
			ASSET_KEYS.CHARACTER_SPRITE,
			ASSET_URLS[ASSET_KEYS.CHARACTER_SPRITE],
			CHARACTER_SPRITESHEET_CONFIG,
		);

		this.load.spritesheet(
			ASSET_KEYS.CHARACTER_IDLE,
			ASSET_URLS[ASSET_KEYS.CHARACTER_IDLE],
			CHARACTER_SPRITESHEET_CONFIG,
		);
	}

	onCreate(): void {
		this.char = new Character(this, 0, 0, ASSET_KEYS.CHARACTER_SPRITE, 0).init();
		this.cameras.main.startFollow(this.char);
		this.game.userInputService.setLocalCharacter(this.char);
	}

	heartbeat(): void {
		this.char.update();
	}

	onShutdown(): void {}
}
