import Phaser from 'phaser';
import GameScene from './scenes/test_scene.ts';


const config: Phaser.Types.Core.GameConfig = 
{
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'app',
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT, // fit to window
    autoCenter: Phaser.Scale.CENTER_BOTH // vertically and horizontally
  }
};

new Phaser.Game(config);

/* FOR DEBUG */
declare global {
  interface Window {
    myPlayer: Phaser.GameObjects.Sprite;
    myScene: GameScene;
  }
}