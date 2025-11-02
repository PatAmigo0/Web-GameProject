import { BasicUI } from '../../core/abstracts/ui/BasicUI';

export class RoomIDDisplay extends BasicUI {
	private roomText!: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		this.init();
	}

	init() {
		this.roomText = this.scene.add.text(0, 0, '', {
			fontSize: '18px',
			color: '#ffffff',
			backgroundColor: 'rgba(0,0,0,0.7)',
			padding: { x: 10, y: 5 },
		});

		this.add(this.roomText);
	}

	public override show(id: string) {
		this.roomText.setText(`ROOM ID: ${id}`);
		this.setVisible(true);
	}
}
