import * as PIXI from 'pixi.js';
import { GameApplication } from './GameApplication';

export class Button extends PIXI.Container {

    protected background: PIXI.Sprite;
    private text: PIXI.Text;
    private label: string;
    protected dispatcher: PIXI.utils.EventEmitter;

    constructor(label: string) {
        super();
        this.label = label;
        this.init();
    }

    protected init() {
        this.dispatcher = new PIXI.utils.EventEmitter()
        this.createBackground();
        this.interactive = true;
        this.onPointerDown = this.onPointerDown.bind(this);
        this.setInteractiveCallbacks();
        this.createText();
    }

    public getDispatcher(): PIXI.utils.EventEmitter {
        return this.dispatcher
    }

    private setInteractiveCallbacks() {
        this.addListener('pointerdown', this.onPointerDown);
        this.addListener('pointerup', this.onPointerUp);
    }

    private createBackground() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0x0000ff);
        gfx.drawRoundedRect(0, 0, 200, 40, 40);
        gfx.endFill();

        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx)
        this.background = new PIXI.Sprite(texture)
        this.addChild(this.background)
    }

    protected onPointerDown() {
        this.background.tint = 0x00ff00;
    }

    protected onPointerUp(){
        this.background.tint = 0xffffff;
    }

    private createText() {
        this.text = new PIXI.Text(this.label, {
            fontFamily: 'Minecraft',
            fontSize: 20,
            fill: 0xffff00
        })
        this.text.anchor.set(0.5);
        this.text.x = this.background.width / 2;
        this.text.y = this.background.height / 2;
        this.addChild(this.text);
    }

}