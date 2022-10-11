import { GameObjectBehavior } from './GameObjectBehavior'
import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from './GameApplication'

export class BallBehavior extends GameObjectBehavior {

    private ball: PIXI.Sprite;
    private velocity: number = 10;
    private arrowUp: boolean = false;
    private arrowDown: boolean = false;
    private setShoot: boolean = false;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
    }

    public destroy() {

        this.gameObjRef.removeChild(this.ball);
        this.ball.destroy({ texture: true, baseTexture: true });

    }

    protected init() {
        this.createBall();
        this.setKeyCallbackEvent();
    }

    private setKeyCallbackEvent() {

        this.onKeyUp = this.onKeyUp.bind(this);
        window.addEventListener('keyup', this.onKeyUp);

        this.onKeyDown = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.onKeyDown);
    }

    public shoot(): boolean {
        return this.setShoot
    }

    private createBall() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffffff);
        gfx.drawCircle(0, 0, 20);
        gfx.endFill();

        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        this.ball = new PIXI.Sprite(texture)

        this.gameObjRef.addChild(this.ball)
    }

    public update(delta: number) {
        if (this.arrowUp && this.gameObjRef.y > 0) {
            this.gameObjRef.y -= this.velocity * delta
        }


        if (this.arrowDown && this.gameObjRef.y < GameApplication.getApp().view.height - this.gameObjRef.height) {
            this.gameObjRef.y += this.velocity * delta
        }
    }

    private onKeyUp(e: any) {
        if (e.code === 'KeyW') {
            this.arrowUp = false;
        }

        if (e.code === 'KeyS') {
            this.arrowDown = false;
        }
        if (e.code === 'KeyB') {
            this.setShoot = false;
        }
    }

    private onKeyDown(e: any) {
        if (e.code === 'KeyW') {
            this.arrowUp = true;
        }

        if (e.code === 'KeyS') {
            this.arrowDown = true;
        }

        if (e.code === "KeyB") {
            this.setShoot = true;
        }
    }

}