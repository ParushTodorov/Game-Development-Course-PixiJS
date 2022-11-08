import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { GameObjectBehavior } from "../GameObjectBehavior";
import { BonusBaseBehavior } from '../BonusBase';

export class BonusStickToPaddle extends BonusBaseBehavior {

    public bonusTimer: number = 10;
    protected static instance: BonusBaseBehavior;
    public name: string = "Stick to Paddle";


    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
        this.init();
    }

    protected init() {
        super.init()
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.STICK_TO_PADDLE, { time: this.bonusTimer });
    }

    public static getInstansce(gameObj: GameObject): GameObjectBehavior {
        return new this(gameObj)
    }

    public destroy(): void {
    }

    public update(deltaTime: number): void {
    }

}