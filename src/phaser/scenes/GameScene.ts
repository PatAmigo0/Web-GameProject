import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private logo: Phaser.GameObjects.Image | null = null;
  
  constructor() {
    super('GameScene');
  }

  preload() {
  }

  create() {
    this.logo = this.add.image(400, 300, 'logo').setInteractive();
    
    this.add.text(400, 450, 'Click the logo!', { 
      fontSize: '32px', 
      color: '#ffffff' 
    }).setOrigin(0.5);

    this.logo.on('pointerdown', () => {
      this.cameras.main.shake(200, 0.01);
    });
  }

  update() {
    if (this.logo) {
      this.logo.rotation += 0.01;
    }
  }
}