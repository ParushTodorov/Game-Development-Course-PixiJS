import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { GameObjectBehavior } from "../GameObjectBehavior";
import { BrickType } from "../../level/BrickType";
import { BaseBrickBehavior } from "../BaseBrickBehavior";

export class BrickBehaviorLevel2 extends BaseBrickBehavior {

    //3 Hits to Destroy

    private hitTimes: number = 0;

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
    }

    protected onBrickHit(e: any) {
        if (e.brickId != this.gameObjRef.getId()) {
            return;
        };

        this.hitTimes++;

        if (this.hitTimes >= 3) {

            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_HIDE, { brickId: e.brickId, brickType: BrickType.TYPE_2 });
            return;
        }

        const renderable: PIXI.Sprite = this.gameObjRef.getRenderableById('brickImg') as PIXI.Sprite;
        switch (this.hitTimes) {
            case 1:
                renderable.tint = 0x0000ff;
                break;
            case 2:
                renderable.tint = 0x00ff00;
                break;
        }
    }

}