import type { GameData } from "../network/NetworkManager";
import { NetworkedScene } from "../classes/NetworkedScene";
import obstacleImg from "../assets/images/typescript.svg";
import playerImg from "../assets/images/vite.svg";
import map from "../assets/maps//json/cave_map_new.json";
import tilesetImg from "../assets/maps/png/Hanzo_B.png";

class test_scene2 extends NetworkedScene
{
    private player! : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key } | undefined;

    constructor()
    {
        super("test_scene2");
    }
    
    onPreload()
    {
        this.load.image('obstacle', obstacleImg);
        this.load.image('player', playerImg);
        this.load.image('tiles', tilesetImg);
        this.load.tilemapTiledJSON('cave_map', map);
    }

    onCreate()
    {
        const map = this.make.tilemap({ key: 'cave_map' });
        const tileset = map.addTilesetImage('Hanzo_B', 'tiles');

        if (tileset === null) {
            console.error("Failed to load tileset.");
            return;
        }

        map.layers.forEach(layerData => {
            map.createLayer(layerData.name, tileset, 0, 0);
        });


        const obstacle = this.add.image(400, 300, 'obstacle');

        this.tweens.add(
            {
                targets: obstacle,
                y: 500,
                duration: 2000,
                ease: 'Power2',
                yoyo: true,
                loop: -1
            }
        );

        this.player = this.physics.add.sprite(800, 300, 'player');
        this.keys = this.input.keyboard?.addKeys('W,A,S,D') as { [key: string]: Phaser.Input.Keyboard.Key };
        this.cameras.main.startFollow(this.player);


    }

    heartbeat(time: number, delta: number): void 
    {
        const moveSpeed = 160;

        this.player.setVelocity(0);

        if (this.keys?.W.isDown) {
            this.player.setVelocityY(-moveSpeed);
        } else if (this.keys?.S.isDown) {
            this.player.setVelocityY(moveSpeed);
        }

        if (this.keys?.A.isDown) {
            this.player.setVelocityX(-moveSpeed);
        } else if (this.keys?.D.isDown) {
            this.player.setVelocityX(moveSpeed);
        }
    }


    onPlayerConnected(peerId: string): void {
        
    }

    onPlayerDisconnected(peerId: string): void {
        
    }

    handleNetworkData(peerId: string, data: GameData): void {
        
    }
}

export default test_scene2;