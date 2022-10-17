import { getCipherInfo } from 'crypto';
import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { BaseView } from './BaseView';


export class ScoreView extends BaseView {

    private score: PIXI.Text;
    protected background: PIXI.Graphics;
    private valuePlayerOne: number;
    private valuePlayerTwo: number;

    constructor() {
        super();
        this.init();
    }

    protected init() {
        this.valuePlayerOne = 0;
        this.valuePlayerTwo = 0;
        this.createBackground();
        this.createScore();
    }

    private createScore() {
        this.score = new PIXI.Text('', {
            fontSize: 20,
            fill: 0xffff00,
            padding: 10,
        })

        this.score.anchor.set(0.5);
        this.score.x = this.background.x + this.background.width / 2;
        this.score.y = this.background.y + this.background.height / 2;

        this.score.text = `${this.valuePlayerOne} : ${this.valuePlayerTwo}`;
        this.addChild(this.score);
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(2, 0xffffff, 1)
        this.background.beginFill();
        this.background.drawRoundedRect(0, 0, 150, 30, 20);

        this.background.x = 15;
        this.background.y = 20;

        this.background.endFill();

        this.background.cacheAsBitmap = true;

        this.addChild(this.background)
    }

    public setScorePlayerOne(score: number) {
        this.valuePlayerOne = score;
        this.score.text = `${this.valuePlayerOne} : ${this.valuePlayerTwo}`;
    }

    public setScorePlayerTwo(score: number) {
        this.valuePlayerTwo = score;
        this.score.text = `${this.valuePlayerOne} : ${this.valuePlayerTwo}`;
    }
}