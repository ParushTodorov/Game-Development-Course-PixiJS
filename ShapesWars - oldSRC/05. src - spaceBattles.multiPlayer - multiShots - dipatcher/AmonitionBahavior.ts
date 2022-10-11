import { GameObjectBehavior } from './GameObjectBehavior'
import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from './GameApplication';
import { EventDispatcher } from './EventDispatcher';
import { SquareBehavior } from './SquareBehavior';
import { versions } from 'process';
import { BallBehavior } from './BallBehavior';

export class AmonitionBahavior extends GameObjectBehavior {

    private amoo: PIXI.Sprite;
    private velocity: number = 10;

    private enemy: GameObject;
    private ownObject: GameObject;

    protected isForDestroy: boolean = false;
    protected isKilled: boolean = false;
    private direction: number = 1;

    constructor(gameObjRef: GameObject, ownObject: GameObject, enemy: GameObject) {
        super(gameObjRef);
        this.enemy = enemy;
        this.ownObject = ownObject;
    }

    public destroy() {
        this.amoo.destroy({ texture: true, baseTexture: true });
        this.gameObjRef.removeChild(this.amoo);
    }

    protected init() {
        this.createAmonition();
    }

    public setSquareObjRef(gameObj: GameObject) {
        this.enemy = gameObj
    }

    private createAmonition() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffff00);
        gfx.drawRoundedRect(0, 0, 5, 5, 1);
        gfx.endFill();

        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        this.amoo = new PIXI.Sprite(texture)

        this.gameObjRef.addChild(this.amoo)
    }

    private inTarget(gameObjPosition: number, enemyStartPosition: number, enemyEndPosition: number): boolean {
        if (enemyStartPosition <= gameObjPosition && gameObjPosition <= enemyEndPosition) {
            return true
        }
    }

    private setDirection(): boolean {
        if (this.ownObject.x < this.enemy.x) {
            return true
        } else {
            return false
        }
    }

    public update(delta: number) {
        if (this.setDirection()) {
            if (this.gameObjRef.x < GameApplication.getApp().view.width) {
                this.gameObjRef.x += this.velocity * delta * this.direction
            } else {
                this.isForDestroy = true
            }
        } else {
            if (this.gameObjRef.x > 0) {
                this.gameObjRef.x -= this.velocity * delta * this.direction
            } else {
                this.isForDestroy = true
            }
        }


        if (this.inTarget(this.gameObjRef.x + this.gameObjRef.width / 2, this.enemy.x, this.enemy.x + this.enemy.width) &&
            this.inTarget(this.gameObjRef.y + this.gameObjRef.height / 2, this.enemy.y, this.enemy.y + this.enemy.height)) {
            this.isKilled = true;
            this.isForDestroy = true;

            if (this.enemy.getBehavior('square') instanceof SquareBehavior) {
                this.enemy.getBehavior('square').setHit()
            } else {
                this.enemy.getBehavior('ball').setHit()
            }
        }

    }
}

