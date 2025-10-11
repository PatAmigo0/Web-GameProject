import { WorkingWithScene } from "../ABC/WorkingWithScene";
import type { BasicGameScene } from "../scene/BasicGameScene";

// Внутренние типы только для AssetManager
type TextureGroups = Record<string, string[]>;
type StringDict = Record<string, string>;

export class AssetManager extends WorkingWithScene
{
    private groupedTextures: TextureGroups = {};
    private jsonFiles: StringDict = {};

    constructor(scene: BasicGameScene) 
    {
        super(scene);
        this.processAllTextures();
    }

    private processAllTextures() : void
    {
        const allTextureModules: StringDict = import.meta.glob('/src/game/assets/maps/png/**/*.png', 
        {
            eager: true,
            query: '?url',
            import: 'default'
        });

        for (const path in allTextureModules) 
        {
            const url = allTextureModules[path];
            const pathParts = path.split('/');
            const folderName = pathParts[pathParts.length - 2]; // [..., <folder_name>, <tileset_name>]

            if (!this.groupedTextures[folderName])
                this.groupedTextures[folderName] = [];
            this.groupedTextures[folderName].push(url);
        }

        const allJSONFiles: StringDict = import.meta.glob('/src/game/assets/maps/json/*.json',
        {
            eager: true,
            query: '?url',
            import: 'default'
        });

        for (const path in allJSONFiles)
        {
            const url = allJSONFiles[path];
            const pathParts = path.split('/');
            const jsonName = pathParts[pathParts.length - 1];

            this.jsonFiles[jsonName.split('.')[0]] = url
        }
    }

    public getMapTilesets(): string[] 
    {
        console.log(this.groupedTextures);
        const tilesetUrls = this.groupedTextures[this.scene.scene.key];
        
        if (!tilesetUrls) 
        {
            console.error(`No textures found for scene key: "${this.scene.scene.key}"`);
            return [];
        }
        
        return tilesetUrls;
    }

    public getMapJSON(): string
    {
        const mapJSON = this.jsonFiles[this.scene.scene.key];
        if (!mapJSON)
        {
            console.error(`No JSON file found for scene key: ${this.scene.scene.key}`);
            return "";
        }

        return mapJSON;
    }

}