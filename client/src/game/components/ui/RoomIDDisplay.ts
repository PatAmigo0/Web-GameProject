//#region IMPORTS
import { BasicUI } from '../../core/abstracts/ui/BasicUI';
//#endregion

//#region CLASS DEFINITION
export class RoomIDDisplay extends BasicUI {
	//#region CLASS ATTRIBUTES
	private roomText!: Phaser.GameObjects.Text;
	//#endregion

	//#region CONSTRUCTOR
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		this.init();
	}
	//#endregion

	//#region INITIALIZATION
	public init() {
		this.roomText = this.scene.add.text(0, 0, '', {
			fontSize: '18px',
			color: '#ffffff',
			backgroundColor: 'rgba(0,0,0,0.7)',
			padding: { x: 10, y: 5 },
		});

		this.add(this.roomText);
	}
	//#endregion

	//#region PUBLIC METHODS
	public override show(id: string) {
		this.roomText.setText(`ROOM ID: ${id}`);
		this.setVisible(true);
	}
	//#endregion

	// NOTE: Здесь можно добавить public hide()
}
//#endregion
