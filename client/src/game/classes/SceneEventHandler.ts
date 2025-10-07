import Phaser from "phaser";

export class SceneEventHandler {
    private scene! : Phaser.Scene;

    constructor(scene: Phaser.Scene)
    {
        this.scene = scene;
    }

    public setupCommonListeners() : void
    {
        this.scene.sys.game.events.on('blur', () => this.scene.input.keyboard?.resetKeys());
        this.scene.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

}