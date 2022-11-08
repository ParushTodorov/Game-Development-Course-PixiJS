import { EventDispatcher } from "../../EventDispatcher";
import { GameEvents } from "../../GameEvents";
import { GameObject } from "../GameObject";
import { GameObjectBehavior } from "./GameObjectBehavior";

export class BaseBrickBehavior extends GameObjectBehavior {
    public static count = 0

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
        BaseBrickBehavior.count++
    }

    public destroy(): void {
        EventDispatcher.getInstance().getDispatcher().removeListener(GameEvents.BRICK_HIT, this.onBrickHit, this);
        EventDispatcher.getInstance().getDispatcher().removeListener(GameEvents.BRICK_SHOOTED, this.onBrickHit, this);
    }

    protected init() {
        super.init();
        this.createDispatchers();
    }

    protected createDispatchers() {
        EventDispatcher.getInstance().getDispatcher().addListener(GameEvents.BRICK_HIT, this.onBrickHit, this);
        EventDispatcher.getInstance().getDispatcher().addListener(GameEvents.BRICK_SHOOTED, this.onBrickHit, this);
    }

    protected onBrickHit(e: any) { }

    public update(deltaTime: number): void {

    }
}
