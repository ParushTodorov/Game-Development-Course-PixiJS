import { BaseView } from './BaseView';
import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { EventDispatcher } from '../EventDispatcher';
import { GameEvents } from '../GameEvents';
import { BrickType } from '../game/level/BrickType';
import { Model } from '../Model';

export class NbrBallView extends BaseView {

    private nbrBallText: PIXI.Text;
    private ball: number;
    protected background: PIXI.Graphics;

    constructor() {
        super();
    }

    protected init() {
        super.init();
        this.createScore();
        this.setNbrBall(Model.getInstance().getTotalNbrBrick());
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(2, 0xffffff, 1)
        this.background.beginFill(0x000000);
        this.background.drawRoundedRect(0, 0, 150, 30, 5);
        this.background.endFill();
        this.background.lineStyle()

        this.background.x = GameApplication.STAGE_WIDTH * 0.1;
        this.background.y = GameApplication.STAGE_HEIGHT * 0.9;

        this.background.cacheAsBitmap = true;

        this.addChild(this.background);
    }

    protected createScore() {
        this.nbrBallText = new PIXI.Text('', {
            fontFamily: 'Minecraft',
            fontSize: 15,
            fill: 0xffffff,
        });

        this.nbrBallText.anchor.set(0.5);
        this.nbrBallText.x = this.background.x + this.background.width / 2;
        this.nbrBallText.y = this.background.y + this.background.height / 2;
        this.nbrBallText.text = `BALLS LEFT:  ${this.ball}`;

        this.addChild(this.nbrBallText)
    }

    public setNbrBall(ball: number) {
        this.ball = ball
        this.nbrBallText.text = `BALLS LEFT:  ${this.ball}`;
    }
}