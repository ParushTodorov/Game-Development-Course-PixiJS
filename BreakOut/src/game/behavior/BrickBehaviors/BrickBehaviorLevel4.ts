import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { GameObjectBehavior } from "../GameObjectBehavior";
import { BrickType } from "../../level/BrickType";
import { BaseBrickBehavior } from "../BaseBrickBehavior";
import { GameApplication } from '../../../GameApplication';
import { Model } from '../../../Model';

export class BrickBehaviorLevel4 extends BaseBrickBehavior {

    //Falling Sky Protocol

    private skyFall: boolean = false;
    private velocity: number;
    private hitPaddleBoolean: boolean = false;


    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
    }

    protected init(): void {
        super.init()
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.PADDLE_HIT, this.hitPaddle, this);
    }

    public destroy(): void {
        super.destroy()
        EventDispatcher.getInstance().getDispatcher().removeListener(GameEvents.PADDLE_HIT, this.hitPaddle, this);
    }

    protected onBrickHit(e: any) {
        if (e.brickId != this.gameObjRef.getId() && !this.skyFall) {
            return;
        };
        if (!this.skyFall) {
            this.activateSkyFallProtocol()
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SKY_FALL)
        }
    }

    private hitPaddle(e: any) {
        if (this.gameObjRef.getId() != e.objId) {
            return;
        };

        this.hitPaddleBoolean = true;
    }

    public activateSkyFallProtocol() {
        console.log(this.gameObjRef.getId(), Model.getInstance().getTotalNbrBrick())
        this.velocity = this.randomVelocity()
        this.skyFall = true;
    }

    private randomVelocity(): number {
        let randomVelocity: number = Math.random() * 50;

        if (!((10 < randomVelocity) && (randomVelocity < 25))) {
            randomVelocity = this.randomVelocity();
        }

        return randomVelocity;
    }

    public update(deltaTime: number): void {
        if (!this.skyFall) {
            return;
        }

        if (!this.hitPaddleBoolean && this.gameObjRef.y < GameApplication.STAGE_HEIGHT) {
            this.gameObjRef.y += this.velocity * deltaTime;
        } else {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_HIDE, { brickId: this.gameObjRef.getId(), brickType: BrickType.TYPE_4 });
        }
    }


}