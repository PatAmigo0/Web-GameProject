// src/scenes/GameScene.ts
import Phaser from 'phaser';
import NetworkManager from '../network/NetworkManager' 
import { type GameData } from '../types/types';

export default class GameScene extends Phaser.Scene 
{
  public network!: NetworkManager; 
  private playerSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private localPlayer!: Phaser.GameObjects.Sprite;

  constructor() 
  {
    super('GameScene');
  }

  preload() {
    this.load.image('player', '../../assets/images/typescript.svg');
  }

  create() 
  {

    this.network = new NetworkManager(this);

    this.localPlayer = this.add.sprite(200, 200, 'player');
   
    this.connectPlayers();
  }

  update() 
  {
 
    this.network.broadcast({
      type: 'move',
      x: this.localPlayer.x,
      y: this.localPlayer.y,
    });
  }


  public async connectPlayers() 
  {
    await this.network.startPeer();

    const urlParams = new URLSearchParams(window.location.search);
    const joinId = urlParams.get('join');

    if (joinId) 
    {
      console.log(`Guest: Attempting to connect to host ${joinId}`);
      this.network.connectToPeer(joinId);
    } 
    else 
    {
      console.log('Host: Waiting for a guest to connect...');
    }
  }

  public showMyId(id: string): void 
  {
    this.add.text(20, 20, `My Room ID: ${id}`, { color: '#ffffff', fontSize: '20px' });
  }

  public onPlayerConnected(peerId: string): void {
    console.log(`Creating sprite for player ${peerId}`);
    const newPlayerSprite = this.add.sprite(100, 100, 'player');
    this.playerSprites.set(peerId, newPlayerSprite);

    this.network.broadcast({
        type: 'move',
        x: this.localPlayer.x,
        y: this.localPlayer.y
    });
  }

  public onPlayerDisconnected(peerId: string): void 
  {
    const playerSprite = this.playerSprites.get(peerId);
    if (playerSprite) 
    {
      playerSprite.destroy();
      this.playerSprites.delete(peerId);
    }
  }

  public handleNetworkData(peerId: string, data: GameData): void 
  {
    const playerSprite = this.playerSprites.get(peerId);
    if (!playerSprite) return;

    switch (data.type) 
    {
      case 'move':
        playerSprite.setPosition(data.x, data.y);
        break;
    }
  }
}