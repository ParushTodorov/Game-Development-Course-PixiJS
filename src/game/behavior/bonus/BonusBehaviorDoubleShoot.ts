import { GameObjectBehavior } from '../GameObjectBehavior';
import { GameObject } from '../../GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from '../../../GameApplication';
import { EventDispatcher } from '../../../EventDispatcher';
import { GameEvents } from '../../../GameEvents';

export class BonusBehaviorDoubleShoot extends GameObjectBehavior {


    private bonusId: string = 'DoubleShoot'
    protected static instance: BonusBehaviorDoubleShoot;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
        this.init()
    }

    public static getInstansce(gameObj: GameObject): GameObjectBehavior {
        return new this(gameObj)
    }

    protected init() {
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SET_BONUS, { bonus: this, gameObjId: this.gameObjRef.getId()})
    }

    public getBonusId() {
        return this.bonusId
    }
}