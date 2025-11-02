import { MAX_DEPTH } from '../../../config/game.config';
import { CoordinatesConverter } from '../../../utils/CoordinatesConverter';

export abstract class BasicUI extends Phaser.GameObjects.Container {
	public realVector!: Phaser.Math.Vector2;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		const vector = CoordinatesConverter.convertXY(scene, x, y);
		super(scene, vector.x, vector.y);

		this.x = vector.x;
		this.y = vector.y;
		this.realVector = new Phaser.Math.Vector2(x, y);

		this.setVisible(false);
		this.setScrollFactor(0);
		this.setDepth(MAX_DEPTH + 1);
		this.scene.add.existing(this);
		this.setPosition(this.x, this.y);
	}

	abstract init(): void;

	public abstract show(...args: any[]): void;

	public hide(...args: any[]): void {
		args;
		this.setVisible(false);
	}
}
