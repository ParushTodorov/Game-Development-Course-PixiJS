import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../EventDispatcher";
import { GameEvents } from "../../../GameEvents";
import { GameObject } from "../../GameObject";
import { BonusBaseBehavior } from '../BonusBase';

export class BonusShootBaseBehavior extends BonusBaseBehavior {

    public timesToShoot: number;
    protected static instance: BonusShootBaseBehavior;
    protected shootTimer: number;
    public bonusTimer: number;
    public name: string = "Rambo mode";

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
    }

    public update(deltaTime: number): void {

    }

}