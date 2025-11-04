import { TypedScene } from '@abstracts/scenes/TypedScene';
import type { IAnimatable, IInputable } from '@gametypes/interface.types';
import { AnimatorComponent } from './playerComponents/AnimatorComponent';
import { InputComponent } from './playerComponents/InputComponent';

export class Character
	extends Phaser.Physics.Arcade.Sprite
	implements IInputable, IAnimatable
{
	public keyinput!: InputComponent;
	public animator!: AnimatorComponent;

	constructor(
		scene: TypedScene,
		x: number,
		y: number,
		texture: string | Phaser.Textures.Texture,
		frame?: string | number,
	) {
		super(scene, x, y, texture, frame);
		this.keyinput = new InputComponent(this);
		this.animator = new AnimatorComponent(this);
	}
}
