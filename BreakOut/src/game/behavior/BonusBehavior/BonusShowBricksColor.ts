import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { GameObjectBehavior } from "../GameObjectBehavior";
import { BonusBaseBehavior } from '../BonusBase';

export class BonusShowBricksColor extends BonusBaseBehavior {

    public bonusTimer: number = 15;
    protected static instance: BonusBaseBehavior;
    public name: string = "Show Brick Color";


    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
        this.init();
    }

    protected init(): void {
        super.init();
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SHOW_BRICKS_COLOR)
    }

    public destroy(): void {
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.HIDE_BRICKS_COLOR)
        EventDispatcher.getInstance().getDispatcher().removeListener(GameEvents.SHOW_BRICKS_COLOR);
        EventDispatcher.getInstance().getDispatcher().off
    }

    public static getInstansce(gameObj: GameObject): GameObjectBehavior {
        return new this(gameObj)
    }

    public update(deltaTime: number): void {

    }

}