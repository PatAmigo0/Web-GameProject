import { Actions } from '@config/controls.config';
import { MAX_DEPTH } from '@config/render.config';
import type { MovementState } from '@gametypes/controls.types';
import type { IAnimatable, IInitializiable, IInputable } from '@gametypes/core.types';
import { AnimatorComponent } from './playerComponents/AnimatorComponent';
import { HealthComponent } from './playerComponents/HealthComponent';
import { InputComponent } from './playerComponents/InputComponent';
import { MoveComponent } from './playerComponents/MoveComponent';

export class Character
	extends Phaser.Physics.Arcade.Sprite
	implements IInputable, IAnimatable, IInitializiable
{
	public keyinput!: InputComponent;
	public animator!: AnimatorComponent;
	public move!: MoveComponent;
	public health!: HealthComponent;

	public init(): Character {
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this, false);

		this.body.setSize(8, 5, false);
		this.body.setOffset(4, 27);
		this.setFrame(0);
		this.setDepth(MAX_DEPTH);

		this.keyinput = new InputComponent();
		this.animator = new AnimatorComponent(this);
		this.move = new MoveComponent(this.body as Phaser.Physics.Arcade.Body);
		this.health = new HealthComponent();

		return this;
	}

	public update(): void {
		const inputAggregation = this.keyinput.getInputState();
		const baseInput = inputAggregation.inputState;
		const movementState: MovementState = {
			[Actions.MoveUp]: baseInput[Actions.MoveUp],
			[Actions.MoveLeft]: baseInput[Actions.MoveLeft],
			[Actions.MoveDown]: baseInput[Actions.MoveDown],
			[Actions.MoveRight]: baseInput[Actions.MoveRight],
		};

		this.move.update(movementState);
	}
}
