import Phaser from 'phaser';
import { Players } from './Players';

export class Game extends Phaser.Game {
    public Players = new Players();
}
