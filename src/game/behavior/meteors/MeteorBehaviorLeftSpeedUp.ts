import { GameObjectBehavior } from '../GameObjectBehavior'
import { GameObject } from '../../GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from '../../../GameApplication';
import { EventDispatcher } from '../../../EventDispatcher';
import { GameEvents } from '../../../GameEvents';

export class MeteorBehaviorLeftSpeedUp extends GameObjectBehavior {

    private velocity: number = 8;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
    }

    protected init() {
    }

    public update(delta: number) {
        this.gameObjRef.rotation -= 0.005 * delta;

        if (this.gameObjRef.y < GameApplication.getApp().view.height) {
            this.gameObjRef.y += this.velocity * delta
            this.gameObjRef.x -= this.velocity * delta * 0.4
        } else {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OUT_OF_STAGE, { gameObj: this.gameObjRef })
            return;
        };
    }
}

