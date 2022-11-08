import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { BrickType } from "../../level/BrickType";
import { BaseBrickBehavior } from "../BaseBrickBehavior";

export class BrickBehaviorLevel7 extends BaseBrickBehavior {

    //Change Colors Brick

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
    }

    protected onBrickHit(e: any) {
        if (e.brickId != this.gameObjRef.getId()) {
            return;
        };

        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.CHANGE_COLORS)
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_HIDE, { brickId: e.brickId, brickType: BrickType.TYPE_7 });

    }
}