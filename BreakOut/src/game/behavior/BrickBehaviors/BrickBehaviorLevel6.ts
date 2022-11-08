import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { GameObjectBehavior } from "../GameObjectBehavior";
import { BrickType } from "../../level/BrickType";
import { BaseBrickBehavior } from "../BaseBrickBehavior";
import { Sprite } from 'pixi.js';

export class BrickBehaviorLevel6 extends BaseBrickBehavior {

    //Static Bricks

    private statcBrick: boolean = false;

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
    }

    protected onBrickHit(e: any) {
        if (e.brickId != this.gameObjRef.getId()) {
            return;
        };

        const renderable = this.gameObjRef.getRenderableById('brickImg') as PIXI.Sprite;
        renderable.tint = 0x8c92ac
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_HIDE, { brickType: BrickType.TYPE_6 });
        this.statcBrick = true;

    }
}