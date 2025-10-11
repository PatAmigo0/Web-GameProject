import type { GameData } from "../types/types";
import { NetworkedScene } from "../classes/scene/NetworkedScene";
import obstacleImg from "../assets/images/typescript.svg";
import playerImg from "../assets/images/hero.png";

class test_scene2 extends NetworkedScene
{
    static readonly sceneName = "cave_map";
    private keys! : { [key: string]: Phaser.Input.Keyboard.Key } | undefined;

    constructor()
    {
        super(test_scene2.sceneName);
    }
    
    onPreload()
    {
        this.load.image('obstacle', obstacleImg);
        this.load.image('player', playerImg);
    }

    onCreate()
    {
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
        this.cameras.main.setZoom(8);

    }

    heartbeat(time: number, delta: number): void 
    {
        const moveSpeed = 200;

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