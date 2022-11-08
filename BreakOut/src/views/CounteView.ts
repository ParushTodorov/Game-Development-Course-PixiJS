import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { BaseView } from './BaseView';
import { Model } from '../Model';
import { EventDispatcher } from '../EventDispatcher';
import { GameEvents } from '../GameEvents';

export class CounterView extends BaseView {

    protected background: PIXI.Graphics;
    private timeText: PIXI.Text;
    private counts: number;

    private times: number = 0;

    constructor() {
        super()
    }

    protected init() {
        super.init();
        GameApplication.getApp().ticker.add(this.update, this)
        this.createBackground();
        this.createText();
        EventDispatcher.getInstance().getDispatcher().addListener(GameEvents.SKY_FALL, this.setCountsToZero, this)
        EventDispatcher.getInstance().getDispatcher().addListener(GameEvents.GAME_LOST, this.setCountsToZero, this)
        EventDispatcher.getInstance().getDispatcher().addListener(GameEvents.NEXT_LEVEL, this.setCountsToZero, this)
        EventDispatcher
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(2, 0xffffff, 1);
        this.background.beginFill(0x000000);
        this.background.drawRoundedRect(0, 0, 130, 30, 5);
        this.background.endFill();
        this.background.cacheAsBitmap = true;

        this.background.x = GameApplication.STAGE_WIDTH * 0.06;
        this.background.y = GameApplication.STAGE_HEIGHT * 0.05;

        this.addChild(this.background);
    }

    private createText() {

        this.timeText = new PIXI.Text('', {
            fontFamily: 'Minecraft',
            fontSize: 15,
            fill: 0xffffff,
        });

        this.timeText.anchor.set(0.5);
        this.timeText.x = this.background.x + this.background.width / 2;
        this.timeText.y = this.background.y + (this.background.height / 2);
        this.addChild(this.timeText);

    }

    public setCounts(time: number) {
        this.show();
        this.counts = time;
    }

    public getCounter(){
        return this.counts
    }

    private setCountsToZero(){
        this.counts = 0;
    }

    private update(deltaTime: number) {
        if (!this.visible) {
            return;
        }

        if (this.counts > 0) {
            const number: number = 1 / 60 * deltaTime;
            this.counts -= number;
            this.timeText.text = 'Bonus timer: ' + Math.round(this.counts);
        } else {
            this.counts = 0;
        }

        if (this.counts === 0) {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BONUS_END);
            this.hide();
        }
    }
}