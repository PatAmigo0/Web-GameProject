import type { BasicGameScene } from "../scene/BasicGameScene";

export abstract class WorkingWithScene {
    protected scene! : BasicGameScene;
    protected sceneName! : string;

    constructor(scene: BasicGameScene)
    {
        this.scene = scene;
        this.sceneName = scene.scene.key;
    }
}