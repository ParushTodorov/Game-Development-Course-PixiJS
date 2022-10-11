import * as PIXI from 'pixi.js';
import { GameApplication } from './GameApplication';


export class ScoreView extends PIXI.Container{

    private score: PIXI.Text;
    private background: PIXI.Sprite;
    private valuePlayerOne: number;
    private valuePlayerTwo: number;

    constructor(valuePlayerOne: number, valuePlayerTwo: number){
        super();
        this.init(valuePlayerOne, valuePlayerTwo);
    }

    private init(valuePlayerOne: number, valuePlayerTwo: number){
        this.valuePlayerOne = valuePlayerOne;
        this.valuePlayerTwo = valuePlayerTwo;
        this.createBackground();
        this.createScore();
    }

    private createScore(){
        this.score = new PIXI.Text('', {
            fontSize: 20,
            fill: 0xffff00,
        })
        
        this.score.anchor.set(0.5);
        this.score.x = this.background.width / 2;
        this.score.y = this.background.height / 2;

        this.score.text = `${this.valuePlayerOne} : ${this.valuePlayerTwo}`;
        this.addChild(this.score);
    }

    private createBackground(){
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0x0000ff);
        gfx.drawRoundedRect(0, 0, 150, 30, 20);
        gfx.endFill();
        
        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        this.background = new PIXI.Sprite(texture)
        this.addChild(this.background)

    }

    public setScorePlayerOne(score: number){
        this.valuePlayerOne = score;
        this.score.text = `${this.valuePlayerOne} : ${this.valuePlayerTwo}`;
    }

    public setScorePlayerTow(score: number){
        this.valuePlayerTwo = score;
        this.score.text = `${this.valuePlayerOne} : ${this.valuePlayerTwo}`;
    }
}