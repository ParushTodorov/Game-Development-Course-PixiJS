import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../EventDispatcher";
import { GameEvents } from "../../GameEvents";
import { GameObject } from "../GameObject";
import { GameObjectBehavior } from "./GameObjectBehavior";
import { BrickType } from "../level/BrickType";
import { BaseBrickBehavior } from "./BaseBrickBehavior";

export class BonusBaseBehavior extends GameObjectBehavior {

    public bonusTimer: number = 15;
    protected static instance: BonusBaseBehavior;
    public name: string = '';


    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
    }

    public static getInstansce(gameObj: GameObject): GameObjectBehavior {
        return new this(gameObj)
    }

    public destroy(): void {
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.CHANGE_COLORS);
    }

    public update(deltaTime: number): void {

    }

}