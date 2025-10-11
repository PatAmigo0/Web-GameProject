import { SceneEventHandler } from "./SceneEventHandler";
import { AssetManager } from "../manager/AssetManager"
import { MapManager } from "../manager/MapManager";
 
/**
 * BasicGameScene - абстрактный класс.
 * Его главная задача - служить шаблонов для всех игровых сцен
 */
export abstract class BasicGameScene extends Phaser.Scene 
{
    protected eventHandler! : SceneEventHandler;
    public assetManager! : AssetManager;
    protected mapManager! : MapManager;
    protected map! : Phaser.Tilemaps.Tilemap;
    protected player! : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    abstract onPreload(): void;
    abstract onCreate(): void;
    abstract heartbeat(time: number, delta: number) : void;

    constructor(sceneKey: string)
    {
        super(sceneKey);
    }

    preload(): void 
    {

        this.assetManager = new AssetManager(this);
        this.mapManager = new MapManager(this);

        this.mapManager.preloadMap();
        this.onPreload();
    }

    create(): void 
    {
        this.eventHandler = new SceneEventHandler(this);
        this.eventHandler.setupCommonListeners();

        this.map = this.mapManager.loadMap()

        this.onCreate();

        this.mapManager.initMapPhysics();
    }

    update(time: number, delta: number): void 
    {
        this.heartbeat(time, delta)
    }

    public getPlayer() : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null
    {
        return this.player;
    }
}