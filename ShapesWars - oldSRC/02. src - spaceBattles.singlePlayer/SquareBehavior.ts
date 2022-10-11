import { GameObjectBehavior } from './GameObjectBehavior'
import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from './GameApplication'

export class SquareBehavior extends GameObjectBehavior {

    private square: PIXI.Sprite;
    private velocity: number = 15;
    private amoRef: GameObject;
    private arrowUp: boolean = false;
    private arrowDown: boolean = false;
    private hitBorder: boolean = false;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
    }

    public destroy() {
        this.square.destroy({ texture: true, baseTexture: true });
        this.gameObjRef.removeChild(this.square);
    }

    protected init() {
        this.createRect();
        this.setKeyCallbackEvent();
    }

    public setAmoRef(gameObj: GameObject) {
        this.amoRef = gameObj
    }

    private createRect() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xff00ff);
        gfx.drawRect(0, 0, 100, 100);
        gfx.endFill();

        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        this.square = new PIXI.Sprite(texture)

        this.gameObjRef.addChild(this.square)
    }

    public update(delta: number) {
        
        if (this.gameObjRef.y + this.gameObjRef.height + this.velocity * delta < GameApplication.getApp().view.height && !this.hitBorder) {
            this.gameObjRef.y += this.velocity * delta
        } else {
            this.hitBorder = true;
        }

        if (this.gameObjRef.y - this.velocity * delta > 0 && this.hitBorder) {
            this.gameObjRef.y -= this.velocity * delta
        } else {
            this.hitBorder = false;
        }
    }
    private setKeyCallbackEvent() {

        this.onKeyUp = this.onKeyUp.bind(this);
        window.addEventListener('keyup', this.onKeyUp);

        this.onKeyDown = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.onKeyDown);

    }

    private onKeyUp(e: any) {
        if (e.code === 'ArrowUp') {
            this.arrowUp = false;
        }

        if (e.code === 'ArrowDown') {
            this.arrowDown = false;
        }

    }

    private onKeyDown(e: any) {
        if (e.code === 'ArrowUp') {
            this.arrowUp = true;
        }

        if (e.code === 'ArrowDown') {
            this.arrowDown = true;
        }
    }
}