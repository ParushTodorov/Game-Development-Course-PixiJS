import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { GameObjectBehavior } from "../GameObjectBehavior";
import { BonusBaseBehavior } from '../BonusBase';

export class BonusExtraLife extends GameObjectBehavior {

    public bonusTimer: number = 0;
    protected static instance: BonusBaseBehavior;
    public name: string = 'Bonus Ball';


    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BALL_INCR)
    }

    public static getInstansce(gameObj: GameObject): GameObjectBehavior {
        return new this(gameObj)
    }

    public update(deltaTime: number): void {

    }

}