import type { GameData } from '../types/types';
import { NetworkedScene } from '../classes/ABC/NetworkedScene';
import obstacleImg from '../assets/images/typescript.svg';
import playerImg from '../assets/images/player1.jpg';

class test_scene_pupula extends NetworkedScene {
	static readonly sceneName = 'test_place2';
	private keys!: { [key: string]: Phaser.Input.Keyboard.Key } | undefined;

	constructor() {
		super(test_scene_pupula.sceneName);
	}

	onPreload() {
		this.load.image('obstacle', obstacleImg);
		this.load.spritesheet('player', playerImg, {
			frameWidth: 16,
			frameHeight: 32
		});

	}

	onCreate() {
		
		const obstacle = this.add.image(400, 300, 'obstacle');

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNames('player', {start: 0, end:3 }),
			frameRate: 8,
			repeat: -1,
		});
		this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

		this.tweens.add({
			targets: obstacle,
			y: 500,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			loop: -1,
		});

		this.player = this.physics.add.sprite(0, 0, 'player');
		this.keys = this.input.keyboard?.addKeys('W,A,S,D') as {
			[key: string]: Phaser.Input.Keyboard.Key;
		};
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setZoom(4);
	}

	heartbeat(time: number, delta: number): void {
		const moveSpeed = 200;

		this.player.setVelocity(0);

		if (this.keys?.W.isDown) {
			this.player.setVelocityY(-moveSpeed);
			this.player.anims.play('walk', true);
		} else if (this.keys?.S.isDown) {
			this.player.setVelocityY(moveSpeed);
			this.player.anims.play('walk', true);
		}

		if (this.keys?.A.isDown) {
			this.player.setVelocityX(-moveSpeed);
			this.player.anims.play('walk', true);
		} else if (this.keys?.D.isDown) {
			this.player.setVelocityX(moveSpeed);
			this.player.anims.play('walk', true);
		}
	}

	onPlayerConnected(peerId: string): void {}

	onPlayerDisconnected(peerId: string): void {}

	handleNetworkData(peerId: string, data: GameData): void {}
}

export default test_scene_pupula;
