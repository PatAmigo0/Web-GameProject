import { WorkingWithScene } from "../ABC/WorkingWithScene";

export class SceneEventHandler extends WorkingWithScene {
    public setupCommonListeners() : void
    {
        this.scene.sys.game.events.on('blur', () => this.scene.input.keyboard?.resetKeys());
        this.scene.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
}