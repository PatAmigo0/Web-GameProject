// src/components/phaser/ui/InteractDisplay.ts
export class InteractDisplay extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Rectangle;
	private text: Phaser.GameObjects.Text;
	private keyIcon: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);

		// Фон
		this.background = scene.add.rectangle(0, 0, 180, 30, 0x000000, 0.8);
		this.background.setStrokeStyle(2, 0xffffff);

		// Иконка клавиши E
		this.keyIcon = scene.add
			.text(-70, 0, 'E', {
				fontSize: '16px',
				color: '#FFFF00',
				fontFamily: 'Arial',
			})
			.setOrigin(0.5);

		// Текст подсказки
		this.text = scene.add
			.text(0, 0, '', {
				fontSize: '14px',
				color: '#FFFFFF',
				fontFamily: 'Arial',
			})
			.setOrigin(0.5);

		// Добавляем все элементы в контейнер
		this.add([this.background, this.keyIcon, this.text]);
		this.setVisible(false);
		this.setDepth(1000); // Поверх всего
	}

	public show(promptText: string): void {
		this.text.setText(promptText);
		this.setVisible(true);
	}

	public hide(): void {
		this.setVisible(false);
	}
}
