import * as PIXI from "pixi.js";
import { BaseView } from './BaseView';
import { GameApplication } from '../GameApplication';
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from "../GameEvents";

export class EndScreen extends BaseView {

    private tittle: PIXI.Text;
    
    constructor() {
        super();
        this.init();
    }

    protected init(){
        super.init();
        this.createText();
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(5, 0xffffff, 1)
        this.background.beginFill(0x253769, 0);
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.beginFill();
        this.background.cacheAsBitmap = true;

        const sprite: PIXI.Sprite = new PIXI.Sprite(GameApplication.BACKGROUND);
        sprite.alpha = 0.85;

        this.addChild(sprite);
        this.addChild(this.background)
    }

    private createText() {
        this.tittle = new PIXI.Text('BETTER FLOWER NEXT TIME', {
            fontFamily: 'Papyrus',
            fill: 0x253769,
            fontSize: 40,
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        });

        this.tittle.resolution = 2;
        this.tittle.anchor.set(0.5);
        this.tittle.x = this.background.width / 2;
        this.tittle.y = this.background.height * 1 / 3;

        this.addChild(this.tittle);
    }
}