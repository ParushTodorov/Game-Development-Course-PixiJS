import { GameObject } from '../GameObject';
import { GameObjectBehavior } from './GameObjectBehavior';
import * as PIXI from 'pixi.js';
import { GameApplication } from '../../GameApplication';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { BrickType } from '../level/BrickType';
import { Model } from '../../Model';

export class PaddleBehavior extends GameObjectBehavior {

    private timeOutId: NodeJS.Timeout;
    private VELOCITY: number = 15;
    private direction: number = 0;
    private moveDist: number = 0
    private paddleWidth: number = 0;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
        this.paddleWidth = this.gameObjRef.width;
    }

    protected init() {
        this.setInitialPosition();

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
        this.createDispatchers();
    }
    
    private createDispatchers(){
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, this.returnToBasic, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, this.setInitialPosition, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIT, this.changePaddleOnBallState, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BALL_LOST, this.returnToBasic, this);
    }

    private changePaddleOnBallState(e: any) {
        if (e.brickType != BrickType.TYPE_3) {
            return;
        };

        let paddle: PIXI.Sprite = this.gameObjRef.getRenderableById('paddleImg') as PIXI.Sprite;

        if (this.timeOutId) {
            clearTimeout(this.timeOutId);
            paddle.width = this.paddleWidth;
        };

        paddle.width *= 1.5;
        paddle.tint = 0xff0000;


        this.timeOutId = setTimeout(() => {
            paddle.width = this.paddleWidth;
            paddle.tint = 0xffffff;
        }, 5000);
    }

    private returnToBasic() {
        const paddle: PIXI.Sprite = this.gameObjRef.getRenderableById('paddleImg') as PIXI.Sprite;
        paddle.width = this.paddleWidth
        paddle.tint = 0xffffff;
    }

    private setInitialPosition() {
        this.gameObjRef.x = (GameApplication.STAGE_WIDTH * 0.5) - (this.gameObjRef.width * 0.5);
        this.gameObjRef.y = GameApplication.STAGE_HEIGHT * 0.8;
        this.paddleWidth = this.gameObjRef.width
    }

    private onKeyUp(e: any) {
        switch (e.code) {
            case "ArrowRight":
                if (this.direction === 1) {
                    this.direction = 0;
                }
                break;
            case "ArrowLeft":
                if (this.direction === -1) {
                    this.direction = 0;
                }
                break;
        }
    }

    private onKeyDown(e: any) {
        if (this.direction !== 0) {
            return;
        }

        switch (e.code) {
            case "ArrowRight":
                this.direction = 1;
                break;
            case "ArrowLeft":
                this.direction = -1;
                break;
        }
    }

    public getMoveDist(): number {
        return this.moveDist;
    }

    private moveLeft(deltaTime: number) {
        if (!this.gameObjRef.isActive()) {
            return;
        }

        if (this.gameObjRef.x - this.VELOCITY > 0) {
            this.moveDist = -(this.VELOCITY * deltaTime);
            this.gameObjRef.x += this.moveDist
        } else {
            this.gameObjRef.x = 0;
            this.moveDist = 0;
        }
    }

    private moveRight(deltaTime: number) {
        if (!this.gameObjRef.isActive()) {
            return;
        }

        if (this.gameObjRef.x + this.gameObjRef.width + this.VELOCITY < GameApplication.STAGE_WIDTH) {
            this.moveDist = this.VELOCITY * deltaTime;
            this.gameObjRef.x += this.moveDist;
        } else {
            this.gameObjRef.x = GameApplication.STAGE_WIDTH - this.gameObjRef.width;
            this.moveDist = 0;
        }
    }

    public update(deltaTime: number) {
        if (this.direction === 1) {
            this.moveRight(deltaTime);
            return;
        }

        if (this.direction === -1) {
            this.moveLeft(deltaTime);
            return;
        }

        this.moveDist = 0;
    }
}