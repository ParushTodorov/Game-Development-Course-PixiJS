import * as PIXI from 'pixi.js';
import { BaseView } from "./BaseView";
import { GameApplication } from "../GameApplication"
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from "../GameEvents";
import { GameSizes } from '../GameSizes';
import { Game } from '../GameController';

export class StartScreen extends BaseView {

    private tittle: PIXI.Text;
    
    private amountText: PIXI.Text;
    private amount: number = Game.AMOUNT;
    
    private betText: PIXI.Text;
    private bet: number = Game.BET;    

    private arrowButton: PIXI.Texture;

    constructor() {
        super();
    }

    protected init() {

        super.init();
        this.bet = Game.BET;
        this.amount = Game.AMOUNT;
        this.arrowButton = PIXI.Texture.from('assets/image/arrowButton1.jpg')
        this.createText();
        this.createCashInput();
        this.createBetInput();
        this.createStartButton();
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(5, 0xffffff, 1)
        this.background.beginFill(0x253769, 0);
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.beginFill();
        this.background.cacheAsBitmap = true;

        const sprite: PIXI.Sprite = new PIXI.Sprite(GameApplication.BACKGROUND);

        this.addChild(sprite);
        this.addChild(this.background)
    }

    private createText() {
        this.tittle = new PIXI.Text('FLOWERS LUCK', {
            fontFamily: 'Papyrus',
            fill: 0x253769,
            fontSize: 70,
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        });

        this.tittle.resolution = 2;
        this.tittle.anchor.set(0.5);
        this.tittle.x = this.background.width / 2;
        this.tittle.y = 150;

        this.addChild(this.tittle);
    }

    private createCashInput() {
        const gfx: PIXI.Graphics = new PIXI.Graphics;
        gfx.lineStyle(3, 0x253769, 1)
        gfx.beginFill(0xffffff)
        gfx.drawRoundedRect(0, 0, GameSizes.resultWidth, GameSizes.resultHeight, 10)
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        this.addChild(gfx);

        gfx.x = GameSizes.resultX;
        gfx.y = GameSizes.resultY;

        this.amountText = new PIXI.Text('', {
            fontFamily: 'Papyrus',
            fontSize: 17,
            fontWeight: 'bold',
            fill: 0x253769, 
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        })

        this.amountText.anchor.set(0.5);
        this.amountText.x = GameSizes.resultX + GameSizes.resultWidth / 2;
        this.amountText.y = GameSizes.resultY + GameSizes.resultHeight / 2;
        console.log(this.amount)
        this.amountText.text = `AMOUNT: ${this.amount}`;

        this.addChild(this.amountText);

        this.createArrows(gfx, 'amount')
    }

    private createBetInput() {
        const gfx: PIXI.Graphics = new PIXI.Graphics;
        gfx.lineStyle(3, 0x253769, 1)
        gfx.beginFill(0xffffff)
        gfx.drawRoundedRect(0, 0, GameSizes.bettWidth, GameSizes.betHeight, 10)
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        this.addChild(gfx);

        gfx.x = GameSizes.betX;
        gfx.y = GameSizes.betY;

        this.betText = new PIXI.Text('', {
            fontFamily: 'Papyrus',
            fontSize: 17,
            fontWeight: 'bold',
            fill: 0x253769, 
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        })

        this.betText.anchor.set(0.5);
        this.betText.x = GameSizes.betX + GameSizes.bettWidth / 2;
        this.betText.y = GameSizes.betY + GameSizes.betHeight / 2;
        this.betText.text = `BET: ${this.bet.toFixed(2)}`

        this.addChild(this.betText);

        this.createArrows(gfx, 'bet')
    }

    private createStartButton() {
        const gfx: PIXI.Graphics = new PIXI.Graphics;
        gfx.lineStyle(3, 0x253769, 1)
        gfx.beginFill(0xffffff)
        gfx.drawRoundedRect(0, 0, GameSizes.buttonWidth, GameSizes.buttonHeight, 10)
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        this.addChild(gfx);

        gfx.x = GameSizes.buttonX;
        gfx.y = GameSizes.buttonY;

        gfx.interactive = true;
        gfx.buttonMode = true;
        gfx.on("pointerdown", () => { EventDispatcher.getInstance().getDispatcher().emit(GameEvents.GAME_START) }, this);

        const text = new PIXI.Text('START', {
            fontFamily: 'Papyrus',
            fontSize: 20,
            fontWeight: 'bold',
            fill: 0x253769, 
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        })

        text.anchor.set(0.5);
        text.x = GameSizes.buttonX + GameSizes.buttonWidth / 2;
        text.y = GameSizes.buttonY + GameSizes.buttonHeight / 2;

        this.addChild(text);
    }

    private createArrows(gfx: PIXI.Graphics, button: string){
        const sprite: PIXI.Sprite = new PIXI.Sprite(this.arrowButton);
        sprite.width = 25;
        sprite.height = 25;

        sprite.x = gfx.x + gfx.width - sprite.width - 6;
        sprite.y = gfx.y + 4;

        sprite.interactive = true;
        sprite.buttonMode = true;

        this.addChild(sprite)

        const sprite2: PIXI.Sprite = new PIXI.Sprite(this.arrowButton);

        sprite2.width = 25;
        sprite2.height = 25;

        
        sprite2.angle = 180;
        

        sprite2.x = gfx.x + gfx.width - 6;
        sprite2.y = gfx.y + gfx.height - 6;

        sprite2.interactive = true;
        sprite2.buttonMode = true;

        this.addChild(sprite2);

        if (button === 'amount') {
            sprite.on("pointerdown", () => {this.amount < 100 ? this.amountChange('+') : this.amount}, this);
            sprite2.on("pointerdown", () => {this.amount > 10 ? this.amountChange('-') : this.amount}, this);
        }

        if (button === 'bet') {
            sprite.on("pointerdown", () => {this.bet < 10 ? this.betChange('+'): this.bet}, this);
            sprite2.on("pointerdown", () => {this.bet > 0.25 ? this.betChange('-'): this.bet}, this);
        }
    }

    private amountChange(symbol: string){
        if (symbol === '+') {
            this.amount ++;
        }
        if (symbol === '-') {
            this.amount --;
        }
        console.log(this.amount)
        this.amountText.text = `AMOUNT: ${this.amount}`;
    }

    private betChange(symbol: string){
        if (symbol === '+') {
            this.bet += 0.25;
        }
        if (symbol === '-') {
            this.bet -= 0.25;
        }
        console.log(this.amount)
        this.betText.text = `BET: ${this.bet.toFixed(2)}`;
    }

    public getAmount(): number {
        return this.amount;
    }
    
    public getBet(): number {
        return this.bet;
    }
}