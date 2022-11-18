import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { Game } from '../GameController';
import { GameSizes } from '../GameSizes';
import { BaseView } from './BaseView';


export class WalletView extends BaseView {

    private text: PIXI.Text;
    protected background: PIXI.Graphics;
    private amount: number = 0;
    
    constructor() {
        super();
    }

    protected init() {
        this.amount = Game.AMOUNT;
        this.createBackground();
        this.createScore();
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(4, 0x374985, 1)
        this.background.beginFill(0x4860ad)
        this.background.drawRoundedRect(0, 0, GameSizes.walletWidth, GameSizes.walletHeight, 3)
        this.background.endFill();

        this.background.x = GameSizes.walletX;
        this.background.y = GameSizes.walletY;

        this.background.endFill();

        this.background.cacheAsBitmap = true;

        this.addChild(this.background)
    }

    private createScore() {
        this.text = new PIXI.Text('', {
            fontFamily: 'Papyrus',
            fontSize: 50,
            fontWeight: 'bold',
            fill: 0xd1d7ea,
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        })

        this.text.anchor.set(0.5);
        this.text.x = this.background.x + this.background.width / 2;
        this.text.y = this.background.y + this.background.height / 2;

        this.text.text = `${this.amount.toFixed(2)}`;
        this.addChild(this.text);
    }

    public setAmount(amount: number) {
        this.amount = amount;
        this.text.text = `${this.amount.toFixed(2)}`;
    }

}