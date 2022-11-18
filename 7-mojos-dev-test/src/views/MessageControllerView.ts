import * as PIXI from 'pixi.js';
import { ReelObjTypes } from '../game/ReelFactory/ReelObjTypes';
import { ReelSymbolTypes } from '../game/ReelFactory/ReelSymbolTypes';
import { GameApplication } from '../GameApplication';
import { Game } from '../GameController';
import { GameSizes } from '../GameSizes';
import { BaseView } from './BaseView';


export class MessageControllerView extends BaseView {

    private text: PIXI.Text;
    protected background: PIXI.Graphics;
    
    constructor() {
        super();
    }

    protected init() {
        super.init();
        this.createBackground();
        this.createText();
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(4, 0x374985, 1)
        this.background.beginFill(0x4860ad)
        this.background.drawRoundedRect(0, 0, GameSizes.resultWidth, GameSizes.resultHeight, 3)
        this.background.endFill();

        this.background.x = GameSizes.resultX;
        this.background.y = GameSizes.resultY;

        this.background.endFill();

        this.background.cacheAsBitmap = true;

        this.addChild(this.background)
    }

    private createText() {
        this.text = new PIXI.Text('', {
            fontFamily: 'Papyrus',
            fontSize: 30,
            fontWeight: 'bold',
            fill: 0xd1d7ea,
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        })

        this.text.anchor.set(0.5);
        this.text.x = this.background.x + this.background.width / 2;
        this.text.y = this.background.y + this.background.height / 2;
        this.addChild(this.text);
    }

    public setWinning(prize: number) {
        this.text.text = `You win ${prize.toFixed(2)} credits!!!`;
    }

    public setEndMessage() { 
        this.text.text = 'Credits: 0.00! To start add credits!'
    }
}