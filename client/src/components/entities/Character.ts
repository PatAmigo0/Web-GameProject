import { CoreScene } from '@abstracts/scene/CoreScene';
import type { IAnimatable, IInputable } from '@gametypes/interface.types';
import { AnimatorComponent } from './playerComponents/AnimatorComponent';
import { HealthComponent } from './playerComponents/HealthComponent';
import { InputComponent } from './playerComponents/InputComponent';
import { MoveComponent } from './playerComponents/MoveComponent';

export class Character
	extends Phaser.Physics.Arcade.Sprite
	implements IInputable, IAnimatable
{
	public keyinput!: InputComponent;
	public animator!: AnimatorComponent;
	public move!: MoveComponent;
	public health!: HealthComponent;

	constructor(
		scene: CoreScene,
		x: number,
		y: number,
		texture: string | Phaser.Textures.Texture,
		frame?: string | number,
	) {
		super(scene, x, y, texture, frame);
		this.keyinput = new InputComponent();
		this.animator = new AnimatorComponent(this);
		this.move = new MoveComponent(this.body as Phaser.Physics.Arcade.Body);
		this.health = new HealthComponent();
	}
}
