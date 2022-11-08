import { BaseView } from './BaseView';
import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { GameEvents } from '../GameEvents';
import { EventDispatcher } from '../EventDispatcher';
import { BrickType } from '../game/level/BrickType';
import { throws } from 'assert';
import { Model } from '../Model';

export class ScoreView extends BaseView {

    protected background: PIXI.Graphics;
    private scoreText: PIXI.Text;
    private score: number = 0;
    
    constructor() {
        super();
    }

    public setScore(score: number) {
        this.score = score;
        this.scoreText.text = `${this.score}`
    }

    protected init() {
        super.init();
        this.createBackground();
        this.createScore();
        this.setScore(Model.getInstance().getScore());
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(2, 0xffffff, 1)
        this.background.beginFill(0x000000);
        this.background.drawRect(0, 0, 100, 30);
        this.background.endFill();

        this.background.x = GameApplication.STAGE_WIDTH * 0.8;
        this.background.y = GameApplication.STAGE_HEIGHT * 0.9;

        this.background.cacheAsBitmap = true;

        this.addChild(this.background);
    }

    protected createScore() {
        this.scoreText = new PIXI.Text('', {
            fontFamily: 'Minecraft',
            fontSize: 15,
            fill: 0xffffff,
        });

        this.scoreText.anchor.set(0.5);
        this.scoreText.x = this.background.x + this.background.width / 2;
        this.scoreText.y = this.background.y + (this.background.height / 2);
        this.scoreText.text = this.score + '';
        this.addChild(this.scoreText)
    }
}