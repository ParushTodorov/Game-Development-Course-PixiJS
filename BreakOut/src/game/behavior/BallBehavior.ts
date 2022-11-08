import { GameObject } from '../GameObject';
import * as PIXI from 'pixi.js';
import { GameObjectBehavior } from './GameObjectBehavior';
import { GameApplication } from '../../GameApplication';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { BrickType } from '../level/BrickType';
import { CounterView } from '../../views/CounteView';
import { GameController } from '../../GameController';
import { constants } from 'buffer';
import { on } from 'events';
import { PaddleBehavior } from './PaddleBehavior';

enum Wall {
    left,
    right,
    top,
    none
}

enum Brick {
    left,
    right,
    top,
    bottom,
    corner,
}


export class BallBehavior extends GameObjectBehavior {

    private paddleRef: GameObject;
    private ballImg: PIXI.Sprite;

    private isPlaying: boolean = false;
    private skyFall: boolean = false;

    private velocity: number = 0;
    private angle: number;

    private timeOutId: NodeJS.Timeout;
    private stickToPaddle: boolean = false;

    //private lastCoordinates: Array<PIXI.Point>;
    //private coordHitBrick: PIXI.Point;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef)
    }


    protected init() {
        this.ballImg = this.gameObjRef.getRenderableById("ballImg") as PIXI.Sprite;
        this.paddleRef = this.gameObjRef.getGameViewRef().getGameObjectById("paddle") as GameObject;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.createDispatchers()
        document.addEventListener("keydown", this.onKeyDown);

    }

    private createDispatchers() {
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIT, this.onBrickHit, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, this.nextLevel, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.PADDLE_HIT, this.paddleHit, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BALL_FREEZE, this.ballFreezeSkyFall, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.STICK_TO_PADDLE, this.ballStickToPaddle, this)
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BONUS_END, this.ballStickToPaddleFalse, this)
    }

    private nextLevel() {
        this.isPlaying = false;
        this.skyFall = false;
        this.velocity = 6;
        this.ballImg.tint = 0xffffff;
    }

    private ballStickToPaddle() {
        this.stickToPaddle = true;
    }

    private ballStickToPaddleFalse() {
        this.stickToPaddle = false
    }

    private ballFreezeSkyFall(e: any) {
        this.isPlaying = false;
        this.skyFall = true;

        setTimeout(() => {
            this.skyFall = false;
        }, e.time)
    }

    public getBallAngle(): number {
        return this.angle;
    }

    public getBallVelocity(): number {
        return this.velocity;
    }

    private paddleHit(e: any) {

        if (!e.objId.includes('brick')) {
            return;
        };

        this.ballLost();
    }

    private move(deltaTime: number) {
        const moveDist: PIXI.Point = new PIXI.Point(this.velocity * Math.sin(this.angle * Math.PI / 180), this.velocity * Math.cos(this.angle * Math.PI / 180));
        const bound: Wall = this.checkBound(moveDist);
        if (bound !== Wall.none) {
            this.changeAngle(bound);
            return;
        }

        if (this.angle === 135 || this.angle === 225) {
            this.gameObjRef.x += moveDist.x * deltaTime;
            this.gameObjRef.y += moveDist.y * deltaTime;
            return;
        }

        if (this.checkOutOfBound(moveDist)) {
            this.ballLost();
            return;
        }

        if (this.checkPaddleCollision(moveDist) && !this.stickToPaddle) {
            this.bouncePaddle();
            return;
        }

        if (this.checkPaddleCollision(moveDist) && this.stickToPaddle) {
            this.isPlaying = false;
        }

        this.gameObjRef.x += moveDist.x * deltaTime;
        this.gameObjRef.y += moveDist.y * deltaTime;
    }

    private ballLost() {
        clearTimeout(this.timeOutId)
        this.ballImg.tint = 0xffffff;
        this.isPlaying = false;
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BALL_LOST, { objId: this.gameObjRef.getId() });

    }

    private checkOutOfBound(moveDist: PIXI.Point): boolean {
        const paddleMoveDist: number = (this.paddleRef.getBehaviorById('paddleBehavior') as PaddleBehavior).getMoveDist();

        return (
            this.gameObjRef.y + (this.gameObjRef.height * 0.5) + moveDist.y > this.paddleRef.y + this.paddleRef.height
        ) && (
                (this.gameObjRef.x + (this.gameObjRef.width * 0.5) < this.paddleRef.x + paddleMoveDist)
                || (this.gameObjRef.x - (this.gameObjRef.width * 0.5) > this.paddleRef.x + this.paddleRef.width + paddleMoveDist)
            ) || (this.gameObjRef.y > this.paddleRef.y);
    }

    private checkPaddleCollision(moveDist: PIXI.Point): boolean {
        const ballRect: PIXI.Rectangle = new PIXI.Rectangle(this.gameObjRef.x - (this.gameObjRef.width * 0.5) + moveDist.x, this.gameObjRef.y - (this.gameObjRef.width * 0.5) + moveDist.y, this.gameObjRef.width, this.gameObjRef.height);
        const paddleRect: PIXI.Rectangle = new PIXI.Rectangle(this.paddleRef.x, this.paddleRef.y, this.paddleRef.width, this.paddleRef.height);

        return (ballRect.left <= paddleRect.right &&
            paddleRect.left <= ballRect.right &&
            ballRect.top <= paddleRect.bottom &&
            paddleRect.top <= ballRect.bottom);
    }

    private bouncePaddle() {
        if (this.angle == 45) {
            this.angle = 135;
            return;
        }

        if (this.angle == 315) {
            this.angle = 225;
            return;
        }
    }

    private changeAngle(bound: Wall) {
        switch (bound) {
            case Wall.left:
                if (this.angle === 225) {
                    this.angle = 135;
                    return;
                }

                if (this.angle === 315) {
                    this.angle = 45;
                    return;
                }
                break;
            case Wall.right:
                if (this.angle === 45) {
                    this.angle = 315;
                    return;
                }

                if (this.angle === 135) {
                    this.angle = 225;
                    return;
                }
                break;
            case Wall.top:
                if (this.angle === 180) {
                    this.angle = Math.round(Math.random()) > 0 ? 45 : 315;
                    return;
                }

                if (this.angle === 225) {
                    this.angle = 315;
                    return;
                }

                if (this.angle === 135) {
                    this.angle = 45;
                    return;
                }
                break;
        }
    }

    private checkBound(moveDist: PIXI.Point): Wall {
        if ((this.gameObjRef.x - (this.gameObjRef.width * 0.5) + moveDist.x < 0)) {
            return Wall.left;
        }

        if ((this.gameObjRef.x + (this.gameObjRef.width * 0.5) + moveDist.x > GameApplication.STAGE_WIDTH)) {
            return Wall.right;
        }

        if ((this.gameObjRef.y - (this.gameObjRef.height * 0.5) + moveDist.y < 0)) {
            return Wall.top;
        }

        return Wall.none
    }

    private checkBoundBrick(brickRect: PIXI.Rectangle): Brick {

        if (this.angle === 45) {
            const cornerPoint: PIXI.Point = new PIXI.Point(brickRect.left, brickRect.top);
            const secondPoint: PIXI.Point = new PIXI.Point(
                brickRect.left - this.velocity * Math.sin(225 * Math.PI / 180) - this.gameObjRef.width / 2,
                brickRect.top - this.velocity * Math.cos(225 * Math.PI / 180) - this.gameObjRef.width / 2
            );

            const thirdPoint: PIXI.Point = new PIXI.Point(
                brickRect.left,
                brickRect.top - this.velocity * Math.cos(225 * Math.PI / 180) - this.gameObjRef.width / 2
            );

            const fourthPoint: PIXI.Point = new PIXI.Point(
                brickRect.left - this.velocity * Math.sin(225 * Math.PI / 180) - this.gameObjRef.width / 2,
                brickRect.top
            );

            if (cornerPoint.x < this.gameObjRef.x && cornerPoint.y > this.gameObjRef.y) {
                return Brick.top;
            } else if (cornerPoint.x > this.gameObjRef.x && cornerPoint.y < this.gameObjRef.y) {
                return Brick.left;
            } else if (this.checkForCornerCollision(cornerPoint, secondPoint, thirdPoint, fourthPoint)) {
                return Brick.corner;
            } else {
                if (this.checkIsInside(cornerPoint, secondPoint, thirdPoint)) {
                    return Brick.top;
                } else {
                    return Brick.left;
                }
            };
        }

        if (this.angle === 135) {
            const cornerPoint: PIXI.Point = new PIXI.Point(brickRect.left, brickRect.bottom);
            const secondPoint: PIXI.Point = new PIXI.Point(
                brickRect.left - this.velocity * Math.sin(315 * Math.PI / 180) - this.gameObjRef.width / 2,
                brickRect.bottom + this.velocity * Math.cos(315 * Math.PI / 180) + this.gameObjRef.width / 2
            );

            const thirdPoint: PIXI.Point = new PIXI.Point(
                brickRect.left,
                brickRect.bottom + this.velocity * Math.cos(315 * Math.PI / 180) + this.gameObjRef.width / 2
            );

            const fourthPoint: PIXI.Point = new PIXI.Point(
                brickRect.left - this.velocity * Math.sin(315 * Math.PI / 180) - this.gameObjRef.width / 2,
                brickRect.bottom
            );

            if (cornerPoint.x < this.gameObjRef.x && cornerPoint.y < this.gameObjRef.y) {
                return Brick.bottom;
            } else if (cornerPoint.x > this.gameObjRef.x && cornerPoint.y > this.gameObjRef.y) {
                return Brick.left;
            } else if (this.checkForCornerCollision(cornerPoint, secondPoint, thirdPoint, fourthPoint)) {
                return Brick.corner;
            } else {
                if (this.checkIsInside(cornerPoint, secondPoint, thirdPoint)) {
                    return Brick.bottom;
                } else {
                    return Brick.left;
                }
            };
        }

        if (this.angle === 180) {
            return Brick.bottom;
        }

        if (this.angle === 225) {
            const cornerPoint: PIXI.Point = new PIXI.Point(brickRect.right, brickRect.bottom);
            const secondPoint: PIXI.Point = new PIXI.Point(
                brickRect.right + this.velocity * Math.sin(45 * Math.PI / 180) + this.gameObjRef.width / 2,
                brickRect.bottom + this.velocity * Math.cos(45 * Math.PI / 180) + this.gameObjRef.width / 2);

            const thirdPoint: PIXI.Point = new PIXI.Point(
                brickRect.right,
                brickRect.bottom + this.velocity * Math.cos(45 * Math.PI / 180) + this.gameObjRef.width / 2
            );

            const fourthPoint: PIXI.Point = new PIXI.Point(
                brickRect.right + this.velocity * Math.sin(45 * Math.PI / 180) + this.gameObjRef.width / 2,
                brickRect.bottom
            );

            if (cornerPoint.x > this.gameObjRef.x && cornerPoint.y < this.gameObjRef.y) {
                return Brick.bottom;
            } else if (cornerPoint.x < this.gameObjRef.x && cornerPoint.y > this.gameObjRef.y) {
                return Brick.right;
            } else if (this.checkForCornerCollision(cornerPoint, secondPoint, thirdPoint, fourthPoint)) {
                return Brick.corner;
            } else {
                if (this.checkIsInside(cornerPoint, secondPoint, thirdPoint)) {
                    return Brick.bottom;
                } else {
                    return Brick.right;
                }
            };
        }

        if (this.angle === 315) {
            const cornerPoint: PIXI.Point = new PIXI.Point(brickRect.right, brickRect.top);
            const secondPoint: PIXI.Point = new PIXI.Point(
                brickRect.right + this.velocity * Math.sin(135 * Math.PI / 180) + this.gameObjRef.width / 2,
                brickRect.top + this.velocity * Math.cos(135 * Math.PI / 180) - this.gameObjRef.width / 2
            );

            const thirdPoint: PIXI.Point = new PIXI.Point(
                brickRect.right,
                brickRect.top + this.velocity * Math.cos(135 * Math.PI / 180) - this.gameObjRef.width / 2
            );

            const fourthPoint: PIXI.Point = new PIXI.Point(
                brickRect.right + this.velocity * Math.sin(135 * Math.PI / 180) + this.gameObjRef.width / 2,
                brickRect.top
            );

            if (cornerPoint.x > this.gameObjRef.x && cornerPoint.y > this.gameObjRef.y) {
                return Brick.top;
            } else if (cornerPoint.x < this.gameObjRef.x && cornerPoint.y < this.gameObjRef.y) {
                return Brick.right;
            } else if (this.checkForCornerCollision(cornerPoint, secondPoint, thirdPoint, fourthPoint)) {
                return Brick.corner;
            } else {
                if (this.checkIsInside(cornerPoint, secondPoint, thirdPoint)) {
                    return Brick.top;
                } else {
                    return Brick.right;
                }
            };
        }
    }

    private calculateArea(a: PIXI.Point, b: PIXI.Point, c: PIXI.Point): number {
        return Math.round(Math.abs(((a.x * (b.y - c.y)) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2))
    }

    private checkIsInside(a: PIXI.Point, b: PIXI.Point, c: PIXI.Point): boolean {
        const gamePoint: PIXI.Point = new PIXI.Point(this.gameObjRef.x, this.gameObjRef.y);
        const areaAll: number = this.calculateArea(a, b, c);
        const area1: number = this.calculateArea(a, b, gamePoint);
        const area2: number = this.calculateArea(a, c, gamePoint);
        const area3: number = this.calculateArea(c, b, gamePoint);

        if (!(areaAll < (area1 + area2 + area3))) {
            return false;
        };

        return true;
    }

    private checkForCornerCollision(a: PIXI.Point, b: PIXI.Point, c: PIXI.Point, d: PIXI.Point): boolean {
        if (this.checkIsInside(a, b, c) && this.checkIsInside(a, b, d)) {
            return true;
        }

        return false;
    }

    private changeAngleAfterBrickHit(bound: Brick) {
        switch (bound) {
            case Brick.right:
                if (this.angle === 225) {
                    this.angle = 135;
                    return;
                }

                if (this.angle === 315) {
                    this.angle = 45;
                    return;
                }
                break;
            case Brick.left:
                if (this.angle === 45) {
                    this.angle = 315;
                    return;
                }

                if (this.angle === 135) {
                    this.angle = 225;
                    return;
                }
                break;
            case Brick.bottom:
                if (this.angle === 180) {
                    this.angle = Math.round(Math.random()) > 0 ? 45 : 315;
                    return;
                }

                if (this.angle === 225) {
                    this.angle = 315;
                    return;
                }

                if (this.angle === 135) {
                    this.angle = 45;
                    return;
                }
                break;
            case Brick.top:
                if (this.angle === 315) {
                    this.angle = 225;
                    return;
                }

                if (this.angle === 45) {
                    this.angle = 135;
                    return;
                }
                break;
            case Brick.corner:
                if (this.angle === 45) {
                    this.angle = 225;
                    return;
                }
                if (this.angle === 135) {
                    this.angle = 315;
                    return;
                }
                if (this.angle === 225) {
                    this.angle = 45;
                    return;
                }
                if (this.angle === 315) {
                    this.angle = 135;
                    return;
                }
                break;

        }
    }

    private followPaddle() {
        this.gameObjRef.x = this.paddleRef.x + (this.paddleRef.width * 0.5);
        this.gameObjRef.y = this.paddleRef.y - (this.gameObjRef.height * 0.5);
    }

    private onKeyDown(e: any) {
        if (!this.gameObjRef.isActive() || this.isPlaying) {
            return;
        }

        if (this.skyFall) {
            return;
        }

        if (e.code === "Space") {
            this.angle = 180;
            this.velocity = 6;
            this.isPlaying = true;
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BALL_ACTIVE);
        }
    }

    private onBrickHit(e: any) {
        //this.coordHitBrick = new PIXI.Point(this.gameObjRef.x, this.gameObjRef.y);
        //this.ballCorection();
        this.changeAngleAfterBrickHit(this.checkBoundBrick(e.brickReck));
        if (e.brickType === BrickType.TYPE_3) {
            this.velocity = 10;
            this.ballImg.tint = 0xff0000;

            if (this.timeOutId) {
                clearTimeout(this.timeOutId);
            }

            this.timeOutId = setTimeout(() => {
                this.velocity = 6;
                this.ballImg.tint = 0xffffff;
            }, 5000);
        }
    }

    public update(deltaTime: number) {
        /*if (!this.lastCoordinates) {
            this.lastCoordinates = [new PIXI.Point(this.gameObjRef.x, this.gameObjRef.y)]
        };*/

        if (!this.isPlaying) {
            this.followPaddle();
        } else {
            this.move(deltaTime);
        }

        //this.addCoordinates();
    }
    /*NOT NEEDED... 
    private addCoordinates() {
        const coord = this.lastCoordinates.pop()

        let x: number = coord.x;
        let y: number = coord.y;

        if (x === this.gameObjRef.x && y === this.gameObjRef.y) {
            this.lastCoordinates.push(coord);
            return;
        }

        this.lastCoordinates.push(coord);
        this.lastCoordinates.push(new PIXI.Point(this.gameObjRef.x, this.gameObjRef.y));
    }

    private ballCorection() {
        for (let i = this.lastCoordinates.length - 1; i >= 0; i--) {
            const coord = this.lastCoordinates[i]

            const x: number = coord.x;
            const y: number = coord.y;

            if (x === this.coordHitBrick.x && y === this.coordHitBrick.y) {
                continue;
            }

            this.gameObjRef.x = coord.x
            this.gameObjRef.y = coord.y

            this.lastCoordinates.push(coord);
            break;
        }
    }*/

}