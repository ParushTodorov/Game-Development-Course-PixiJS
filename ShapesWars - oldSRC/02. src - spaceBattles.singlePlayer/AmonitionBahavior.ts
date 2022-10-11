import { GameObjectBehavior } from './GameObjectBehavior'
import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from './GameApplication'

export class AmonitionBahavior extends GameObjectBehavior {

    private amoo: PIXI.Sprite;
    private velocity: number = 10;
    private squareObjRef: GameObject;
    protected isForDestroy: boolean = false;
    protected isKilled: boolean = false;

    constructor(gameObjRef: GameObject, squareObjRef:GameObject) {
        super(gameObjRef);
        this.squareObjRef = squareObjRef;
    }

    public destroy() {
        this.amoo.destroy({ texture: true, baseTexture: true });
        this.gameObjRef.removeChild(this.amoo);       
    }

    protected init() {
        this.createAmonition();
    }

    public setSquareObjRef(gameObj: GameObject){
        this.squareObjRef = gameObj
    }

    private createAmonition() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffff00);
        gfx.drawRoundedRect(this.setX(), this.setY(), 5, 5, 1);
        gfx.endFill();

        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        this.amoo = new PIXI.Sprite(texture)

        this.gameObjRef.addChild(this.amoo)
    }
    
    private setX() {
        return this.gameObjRef.x + (this.gameObjRef.width /2)
    }

    private setY(){
        return this.gameObjRef.y + (this.gameObjRef.height/2)
    }

    public update(delta: number) {
        if (this.gameObjRef.x < GameApplication.getApp().view.width) {
            this.gameObjRef.x += this.velocity * delta
        } else {
            this.isForDestroy = true
        }

        if (this.gameObjRef.x >= this.squareObjRef.x && this.gameObjRef.x <= this.squareObjRef.x + this.squareObjRef.width 
            && this.gameObjRef.y > this.squareObjRef.y && this.gameObjRef.y < this.squareObjRef.y + this.squareObjRef.height){
                this.isKilled = true;
                this.isForDestroy = true;
                console.log(this.gameObjRef.x, this.gameObjRef.y, this.isKilled)
            }
    }
   
}