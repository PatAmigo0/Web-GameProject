import Phaser from 'phaser';
import { Players } from './services/PlayerService';
import { NetworkService } from './services/NetworkService';

export class Game extends Phaser.Game {
	public Players = new Players();
	public NetworkSerive = new NetworkService();

	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
		this.registry.set('NetworkService', this.NetworkSerive);
	}
}
