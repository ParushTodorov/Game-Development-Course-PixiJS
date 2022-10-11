import { GameObjectBehavior } from './GameObjectBehavior'
import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from './GameApplication'

export class AmonitionBahavior extends GameObjectBehavior {

    private amoo: PIXI.Sprite;
    private velocity: number = 10;
    private ballObjRef: GameObject;
    private squareObjRef: GameObject;

    constructor(gameObjRef: GameObject, ballObjRef: GameObject, squareObjRef:GameObject) {
        super(gameObjRef);
        this.ballObjRef = ballObjRef;
        this.squareObjRef = squareObjRef;
    }

    public destroy() {
        
        this.gameObjRef.removeChild(this.amoo);
        this.amoo.destroy({ texture: true, baseTexture: true });
        
    }

    protected init() {
        this.createAmonition();
    }

    public setBallObjRef(gameObj: GameObject){
        this.ballObjRef = gameObj
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
        return this.ballObjRef.x + (this.ballObjRef.width /2)
    }

    private setY(){
        return this.ballObjRef.y + (this.ballObjRef.height/2)
    }

    public update(delta: number) {
        if (this.gameObjRef.x < GameApplication.getApp().view.width) {
            this.gameObjRef.x += this.velocity * delta
        } else {
            this.destroy()
        }

        if (this.gameObjRef.x >= this.squareObjRef.x && this.gameObjRef.x <= this.squareObjRef.x + this.squareObjRef.width 
            && this.gameObjRef.y < this.squareObjRef.y && this.gameObjRef.y > this.squareObjRef.y + this.squareObjRef.height){
                this.destroy()
            }
    }
   
}