import { EventDispatcher } from "../../EventDispatcher";
import { GameObject } from "../GameObject";

export class GameObjectBehavior {

    protected gameObjRef: GameObject;

    constructor(gameObjRef: GameObject) {
        this.gameObjRef = gameObjRef;

        this.init();
    }

    public update(deltaTime: number) { }

    public destroy() {
        EventDispatcher.getInstance().getDispatcher().removeAllListeners;
        EventDispatcher.getInstance().getDispatcher().off;
    }

    protected init() { }
}