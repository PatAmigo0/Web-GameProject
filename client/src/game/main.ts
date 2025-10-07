import Phaser from 'phaser';
import GameScene from './scenes/test_scene.ts';
import test_scene2 from './scenes/test_scene2.ts';

const config: Phaser.Types.Core.GameConfig = 
{
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'app',
  scene: [test_scene2],
  scale: {
    mode: Phaser.Scale.FIT, // fit to window
    autoCenter: Phaser.Scale.CENTER_BOTH // vertically and horizontally
  },
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
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