// scene/MainMenuScene.ts

import { NetworkService } from '../services/NetworkService';
import { NamedScene } from '../utils/ABC/NamedScene';
import { SceneKey } from '../utils/decorator/SceneKey.decorator';

@SceneKey('MainMenuScene')
export class MainMenuScene extends NamedScene {
	private NetworkService!: NetworkService;
	private myIdText!: Phaser.GameObjects.Text;
	private hostIdInput!: HTMLInputElement;

	create() {
		// Получаем наш NetworkService, который был создан в BootScene
		this.NetworkService = this.registry.get('NetworkService');

		// 1. Кнопка "Создать игру" (Хост)
		const createGameBtn = this.add
			.text(
				this.cameras.main.centerX,
				200,
				'Создать игру (быть хостом)',
				{
					fontSize: '24px',
					backgroundColor: '#007bff',
					padding: { x: 10, y: 5 },
				},
			)
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		this.createJoinUI();

		this.myIdText = this.add
			.text(this.cameras.main.centerX, 500, 'Подключение к сети...', {
				fontSize: '18px',
			})
			.setOrigin(0.5);

		// --- Настраиваем логику кнопок ---

		// Логика для Хоста
		createGameBtn.on('pointerdown', async () => {
			console.log('Начинаю игру как хост...');
			const myId = await this.NetworkService.startPeer(true);

			this.myIdText.setText(
				`Игра создана! Ваш ID: ${myId}\n(Сообщите его друзьям)`,
			);

			this.scene.start('test_place');
		});

		document
			.getElementById('join-game-btn')
			?.addEventListener('click', async () => {
				const hostId = this.hostIdInput.value;
				if (!hostId) {
					alert('Пожалуйста, введите ID хоста');
					return;
				}

				console.log(`Присоединяюсь к хосту ${hostId}...`);
				await this.NetworkService.startPeer(false, hostId);

				this.scene.start('test_scene2');
			});
	}

	// Вспомогательный метод для создания HTML элементов
	private createJoinUI(): void {
		// Создаем HTML Input элемент с помощью Phaser DOMElement
		this.hostIdInput = document.createElement('input');
		this.hostIdInput.type = 'text';
		this.hostIdInput.placeholder = 'Введите ID хоста';
		this.add.dom(this.cameras.main.centerX, 300, this.hostIdInput);

		// Создаем HTML кнопку
		const joinButton = document.createElement('button');
		joinButton.id = 'join-game-btn';
		joinButton.innerText = 'Присоединиться к игре';
		this.add.dom(this.cameras.main.centerX, 350, joinButton);
	}

	// Не забываем удалить HTML элементы при выходе со сцены
	shutdown() {
		this.hostIdInput?.remove();
		document.getElementById('join-game-btn')?.remove();
	}
}
