import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../../EventDispatcher";
import { GameEvents } from "../../../../GameEvents";
import { GameObject } from "../../../GameObject";
import { BonusShootBaseBehavior } from '../BonusShootBaseBehavior';

export class BonusShootTwice extends BonusShootBaseBehavior {

    public timesToShoot: number = 2;
    protected static instance: BonusShootTwice;
    protected shootTimer: number = 1;
    public bonusTimer: number = 12;

    constructor(gameOBjRef: GameObject) {
        super(gameOBjRef);
        this.init()
    }

    protected init() {
    }

    public update(deltaTime: number): void {

        const timerChange = deltaTime * 1 / 60;
        this.shootTimer -= timerChange;

        if (Math.floor(this.shootTimer) === 0) {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SHOOT, { timesToShoot: this.timesToShoot });
            this.shootTimer = 2;
        }
    }

}  