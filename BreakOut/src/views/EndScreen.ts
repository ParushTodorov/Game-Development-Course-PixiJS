import * as PIXI from "pixi.js";
import { BaseView } from './BaseView';
import { GameApplication } from '../GameApplication';


export class EndScreen extends BaseView {

    protected background: PIXI.Graphics;
    private tittle: PIXI.Text;
    private description: PIXI.Text;

    constructor() {
        super();
        this.setBackground();
        this.createText();
    }

    private setBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle({ width: 2, color: 0xffffff });
        this.background.beginFill(0x000000);
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.beginFill();
        this.background.cacheAsBitmap = true;

        this.addChild(this.background)
    }

    private createText() {
    this.tittle = new PIXI.Text('YOU LOST', {
        fontFamily: 'Minecraft',
        fill: 0xffffff,
        fontSize: 40,
    });

    this.tittle.resolution = 2;
    this.tittle.anchor.set(0.5);
    this.tittle.x = this.background.width / 2;
    this.tittle.y = 250;

    this.addChild(this.tittle);

    this.description = new PIXI.Text('PRESS ANY KET TO START', {
        fontFamily: 'Minecraft',
        fill: 0xffffff,
        fontSize: 25,
    });

    this.description.resolution = 2;
    this.description.anchor.set(0.5);
    this.description.x = this.background.width / 2;
    this.description.y = this.tittle.y + 40;

    this.addChild(this.description);
}
}