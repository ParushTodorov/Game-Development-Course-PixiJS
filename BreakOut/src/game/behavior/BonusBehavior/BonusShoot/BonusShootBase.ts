import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../../EventDispatcher";
import { GameEvents } from "../../../../GameEvents";
import { GameObject } from "../../../GameObject";
import { BonusShootBaseBehavior } from '../BonusShootBaseBehavior';

export class BonusShootBehavior extends BonusShootBaseBehavior {

    public timesToShoot: number = 1;
    protected static instance: BonusShootBehavior;
    protected shootTimer: number = 1;
    public bonusTimer: number = 14;

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
        this.init()
    }

    public update(deltaTime: number): void {

        const timerChange = deltaTime * 1 / 60
        this.shootTimer -= timerChange

        if (Math.floor(this.shootTimer) === 0) {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SHOOT, { timesToShoot: this.timesToShoot });
            this.shootTimer = 2;
        }
    }
}  