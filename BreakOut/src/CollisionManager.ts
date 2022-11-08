import * as PIXI from 'pixi.js';
import { GameObject } from './game/GameObject'
import { EventDispatcher } from './EventDispatcher';
import { GameEvents } from './GameEvents';
import { GameObjectBehavior } from './game/behavior/GameObjectBehavior';
import { BrickBehaviorLevel1 } from './game/behavior/BrickBehaviors/BrickBehaviorLevel1';
import { BrickBehaviorLevel2 } from './game/behavior/BrickBehaviors/BrickBehaviorLevel2';
import { BrickBehaviorLevel3 } from './game/behavior/BrickBehaviors/BrickBehaviorLevel3';
import { BrickType } from './game/level/BrickType';
import { BrickBehaviorLevel4 } from './game/behavior/BrickBehaviors/BrickBehaviorLevel4';
import { BrickBehaviorLevel5 } from './game/behavior/BrickBehaviors/BrickBehaviorLevel5';
import { BaseBrickBehavior } from './game/behavior/BaseBrickBehavior';
import { BrickBehaviorLevel6 } from './game/behavior/BrickBehaviors/BrickBehaviorLevel6';
import { BallBehavior } from './game/behavior/BallBehavior';

export class CollisionManager {

    private objList: Array<GameObject> = [];
    private ammoList: Array<GameObject> = [];
    private ballRef: GameObject;
    private paddleRef: GameObject;
    private brickHit: boolean;

    constructor() {

    }

    public registerBall(gameObj: GameObject) {
        this.ballRef = gameObj
    }

    public registerPaddle(gameObj: GameObject) {
        this.paddleRef = gameObj
    }

    public registerBrickObj(gameObj: GameObject) {
        this.objList.push(gameObj);
    }

    public unregisteredObject(brickId: string) {
        for (let i = this.objList.length - 1; i >= 0; i--) {

            if (this.objList[i].getId() != brickId) {
                continue;
            }
            this.objList.splice(i, 1);
            break;
        }
    }

    public registerAmmoObj(gameObj: GameObject) {
        this.ammoList.push(gameObj);
    }

    public unregisteredAmmoObject(brickId: string) {
        for (let i = this.ammoList.length - 1; i >= 0; i--) {

            if (this.ammoList[i].getId() != brickId) {
                continue;
            }
            this.ammoList.splice(i, 1);
            break;
        }
    }

    public clear() {
        this.ammoList = []
        this.objList = [];
    }

    private isReckHitted(obj1: PIXI.Rectangle, obj2: PIXI.Rectangle): boolean {
        if (obj1.left <= obj2.right &&
            obj2.left <= obj1.right &&
            obj1.top <= obj2.bottom &&
            obj2.top <= obj1.bottom) {
            return true;
        }

        return false;
    }

    public static setBrickType(obj: GameObject) {
        const behavior: GameObjectBehavior = obj.getBehaviorById('brickBehavior')

        let brickType: BrickType;

        if (behavior instanceof BrickBehaviorLevel1) {
            brickType = BrickType.TYPE_1;
        } else if (behavior instanceof BrickBehaviorLevel2) {
            brickType = BrickType.TYPE_2;
        } else if (behavior instanceof BrickBehaviorLevel3) {
            brickType = BrickType.TYPE_3;
        } else if (behavior instanceof BrickBehaviorLevel4) {
            brickType = BrickType.TYPE_4;
        } else if (behavior instanceof BrickBehaviorLevel5) {
            brickType = BrickType.TYPE_5;
        } else if (behavior instanceof BrickBehaviorLevel6) {
            brickType = BrickType.TYPE_6;
        }
        return brickType;
    }

    private calculateMoveDist(): PIXI.Point {
        const velocity: number = (this.ballRef.getBehaviorById('ballBehavior') as BallBehavior).getBallVelocity();
        const angle: number = (this.ballRef.getBehaviorById('ballBehavior') as BallBehavior).getBallAngle();

        return new PIXI.Point(velocity * Math.sin(angle * Math.PI / 180), velocity * Math.cos(angle * Math.PI / 180));
    }

    public update() {
        if (!this.ballRef) {
            return;
        }

        const moveDist: PIXI.Point = this.calculateMoveDist();
        this.brickHit = false;

        const ballReck: PIXI.Rectangle = new PIXI.Rectangle(
            this.ballRef.x + moveDist.x - this.ballRef.width / 2,
            this.ballRef.y + moveDist.y - this.ballRef.width / 2,
            this.ballRef.width,
            this.ballRef.height);

        const paddleReck: PIXI.Rectangle = new PIXI.Rectangle(
            this.paddleRef.x, 
            this.paddleRef.y, 
            this.paddleRef.width, 
            this.paddleRef.height);

        this.objList.forEach((obj) => {

            const objReck: PIXI.Rectangle = new PIXI.Rectangle(obj.x, obj.y, obj.width, obj.height);

            if (this.isReckHitted(objReck, paddleReck)) {
                EventDispatcher.getInstance().getDispatcher().emit(GameEvents.PADDLE_HIT, { objId: obj.getId() });
            }

            if (!obj.getId().includes('brick')) {
                return;
            }

            if (!this.brickHit && (this.isReckHitted(objReck, ballReck))) {
                const brickType: BrickType = CollisionManager.setBrickType(obj);
                this.brickHit = true;
                EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_HIT, { brickId: obj.getId(), brickType: brickType, brickReck: objReck });
            }

            this.ammoList.forEach((ammo) => {
                const ammoReck: PIXI.Rectangle = new PIXI.Rectangle(ammo.x, ammo.y, ammo.width, ammo.height)
                if (this.isReckHitted(objReck, ammoReck)) {
                    EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJ_DESTROYED, { Id: ammo.getId() })
                    const brickType: BrickType = CollisionManager.setBrickType(obj);
                    EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BRICK_SHOOTED, { brickId: obj.getId(), brickType: brickType })
                }
            })
        })
    }


}