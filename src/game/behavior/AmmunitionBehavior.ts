import { GameObjectBehavior } from './GameObjectBehavior'
import { GameObject } from '../GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from '../../GameApplication';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';

export class AmmunitionBehavior extends GameObjectBehavior {

    private velocity: number = 15;

    private enemy: GameObject;
    private ownObject: GameObject;

    protected isForDestroy: boolean = false;
    protected isKilled: boolean = false;
    private direction: number = 1;

    constructor(gameObjRef: GameObject, ownObject: GameObject, enemy: GameObject) {
        super(gameObjRef);
        this.enemy = enemy;
        this.ownObject = ownObject;
        this.direction = this.setDirection();
    }

    protected init() {
    }

    private inTarget(gameObjPosition: number, enemyStartPosition: number, enemyEndPosition: number): boolean {
        if (enemyStartPosition <= gameObjPosition && gameObjPosition <= enemyEndPosition) {
            return true
        }

        return false
    }

    private setDirection() {
        if (this.ownObject.x < this.enemy.x) {
            return 1
        } else {
            return -1
        }
    }

    public update(delta: number) {
        if (this.gameObjRef.x < GameApplication.getApp().view.width) {
            this.gameObjRef.x += this.velocity * delta * this.direction
        } else {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OUT_OF_STAGE, {gameObj: this.gameObjRef})
            return;
        };

        if (this.inTarget(this.gameObjRef.x + this.gameObjRef.width / 2, this.enemy.x, this.enemy.x + this.enemy.width) &&
            this.inTarget(this.gameObjRef.y + this.gameObjRef.height / 2, this.enemy.y, this.enemy.y + this.enemy.height)) {

            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.AMMO_HIT, {hittedobject: this.enemy, hitter: this.ownObject, ammo: this.gameObjRef})
        }
    }
}

