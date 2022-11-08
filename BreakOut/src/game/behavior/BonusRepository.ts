import { GameObjectBehavior } from './GameObjectBehavior';
import { GameObject } from '../GameObject';
import { GameApplication } from '../../GameApplication';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { BonusBaseBehavior } from "./BonusBase";
import { BonusShootBehavior } from "./BonusBehavior/BonusShoot/BonusShootBase";
import { BonusShootTwice } from "./BonusBehavior/BonusShoot/BonusShootTwice";
import { BonusShootThreesome } from "./BonusBehavior/BonusShoot/BonusShootThreesome";
import { BonusShowBricksColor } from "./BonusBehavior/BonusShowBricksColor";
import { BonusStickToPaddle } from "./BonusBehavior/BonusStickToPaddle";
import { BonusExtraLife } from './BonusBehavior/BonusExtraLife'

export class BonusRepository extends GameObjectBehavior {

    protected gameObjRef: GameObject;
    protected bonusList = [BonusShootBehavior, BonusShootTwice, BonusShootThreesome, BonusShowBricksColor, BonusStickToPaddle, BonusExtraLife];
    private hitPaddleBoolean: boolean = false;
    private velocity: number = 3;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef)
        this.gameObjRef = gameObjRef;
        this.init();
    }

    protected init() {
        super.init();
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.PADDLE_HIT, this.setHitPaddle, this);
    }

    public destroy(): void {
        EventDispatcher.getInstance().getDispatcher().removeListener(GameEvents.PADDLE_HIT, this.setHitPaddle, this);
        EventDispatcher.getInstance().getDispatcher().off
    }

    public getBehavior(gameObj: GameObject) {
        const index: number = Math.floor(this.bonusList.length * Math.random())
        return this.bonusList[index].getInstansce(gameObj)
    }

    private setHitPaddle() {
        this.hitPaddleBoolean = true;
    }

    public update(deltaTime: number) {

        if (!this.hitPaddleBoolean && this.gameObjRef.y < GameApplication.STAGE_HEIGHT) {
            this.gameObjRef.y += this.velocity * deltaTime;
        } else {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJ_DESTROYED, { Id: this.gameObjRef.getId() });
        }
    }
}