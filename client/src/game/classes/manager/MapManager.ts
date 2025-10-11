import { WorkingWithScene } from "../ABC/WorkingWithScene";

export class MapManager extends WorkingWithScene 
{
    /* CLASS FIELDS */
    private map! : Phaser.Tilemaps.Tilemap; // Поле хранит ссылку на класс 'карта' из сцены
    
    // Metadata
    private mapTextures : Map<string, string> = new Map(); // Для хранения всех url текстурок, используемых картой
    private tilesets : Phaser.Tilemaps.Tileset[] = []; 
    private collidable : Phaser.Tilemaps.TilemapLayer[] = [];

    /* PUBLIC METHODS */
    public preloadMap() : void // Автоматически запускается при предварительной загрузки ассетов для сцены
    {
        this.scene.assetManager.getMapTilesets().forEach(url => 
        {
            console.log(`Loading asset: ${url}`);
            
            const pathParts = url.split('/');
            const tilesetName = pathParts[pathParts.length - 1].split('.')[0]; // Получаем имя текстурки без расширения .png ([<file_name>, <extension>])

            this.scene.load.image(tilesetName, url);
            this.mapTextures.set(tilesetName, url);
        });

        console.log(this.scene.load.tilemapTiledJSON(this.sceneName, this.scene.assetManager.getMapJSON()));
    }

    public loadMap() : Phaser.Tilemaps.Tilemap // Автоматически запускается при загрузке (на экран) заранее подгруженных ассетов карты из preloadMap
    {
        this.map = this.scene.make.tilemap({key: this.sceneName});

        this.map.tilesets.forEach(tileset => this._addTilesetImage(tileset.name)); // Загружаем текстурки для tileset-ов
        this.map.layers.forEach(layerData => this._createLayer(layerData)); // Создаем слои на основе наших tileset-ов

        // [DEBUG]
        this.map.tilesets.forEach(tileset => 
        {
            console.log(`  - Tileset Name: ${tileset.name}`);
            console.log(`  - Tile Size: ${tileset.tileWidth}x${tileset.tileHeight}`);
            console.log(`  - First GID: ${tileset.firstgid}`);
            console.log(`  - Image Texture Key: ${tileset.image?.key}`);
        });

        return this.map;
    }

    public initMapPhysics(): void // Автоматически запускается после onCreate для полной инициализации физики мира
    {
        console.log(this.collidable);
        this.collidable.forEach(layer => 
        {
            const plr = this.scene.getPlayer();
            if (plr) this.scene.physics.add.collider(plr, layer);
            else 
            {
                console.error("Не удалось получить игрока сцены. Он точно был инициализирован?");
                return;
            }
        });
    }

    /* PRIVATE METHODS */
    private _addTilesetImage(tilesetName: string) : void
    {
        const tileset = this.map.addTilesetImage(tilesetName, tilesetName, 16, 16);
        if (tileset) this.tilesets.push(tileset);
        else console.warn("Ошибка при создании tileset. !ОСТОРОЖНО!");
    }

    private _createLayer(layerData: Phaser.Tilemaps.LayerData) : void
    {
        const layer = this.map.createLayer(layerData.name, this.tilesets, 0, 0);
        const properties = layerData.properties as [{name?: string, type?: string, value? : boolean}];
 
        if (!Array.isArray(properties))
        {
            console.error("Используется старый формат свойств. Работать ничего не будет");
            return;
        }
        else if (layer && properties.find(p => p.name == 'collides')?.value == true) 
        {   
            layer.setCollisionByExclusion([-1]);
            this.collidable.push(layer);   
        }
        else if (!layer) console.warn("Ошибка создания слоя на карте");
    }
}