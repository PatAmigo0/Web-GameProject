export class CoordinatesConverter {
	public static convertXY(scene: Phaser.Scene, x: number, y: number): Phaser.Math.Vector2 {
		const parentSize = scene.scale.parentSize;
		const displaySize = scene.scale.displaySize;
		const gameSize = scene.scale.gameSize;

		const scale = displaySize.width / gameSize.width;

		const offsetX_px = Math.max(0, (displaySize.width - parentSize.width) / 2);
		const offsetY_px = Math.max(0, (displaySize.height - parentSize.height) / 2);

		const safeX_logical = offsetX_px / scale + x;
		const safeY_logical = offsetY_px / scale + y;

		return { x: safeX_logical, y: safeY_logical } as Phaser.Math.Vector2;
	}
}
