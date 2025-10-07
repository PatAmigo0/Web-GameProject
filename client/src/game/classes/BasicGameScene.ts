import { SceneEventHandler } from "./SceneEventHandler";

/**
 * NetworkedScene - абстрактный класс.
 * Его главная задача - служить шаблонов для всех игровых сцен
 */
export abstract class BasicGameScene extends Phaser.Scene 
{
    private eventHandler! : SceneEventHandler;

    abstract onPreload(): void;
    abstract onCreate(): void;
    abstract heartbeat(time: number, delta: number) : void;

    preload(): void 
    {
        this.onPreload();
    }

    create(): void 
    {
        this.eventHandler = new SceneEventHandler(this);
        this.eventHandler.setupCommonListeners();

        this.onCreate();
    }

    update(time: number, delta: number): void 
    {
        this.heartbeat(time, delta)
    }
}