import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { GameObjectBehavior } from "../GameObjectBehavior";
import { BrickType } from "../../level/BrickType";
import { BaseBrickBehavior } from "../BaseBrickBehavior";

export class BrickBehaviorLevel3 extends BaseBrickBehavior {

    //Ball and Paddle go faster and red

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
    }

    protected onBrickHit(e: any) {
        if (e.brickId != this.gameObjRef.getId()) {
            return;
        }

        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_HIDE, { brickId: e.brickId, brickType: BrickType.TYPE_3 });
    }
}
