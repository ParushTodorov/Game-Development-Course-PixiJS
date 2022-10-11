import { construct } from 'core-js/fn/reflect';
import * as PIXI from 'pixi.js';


export class ScoreView extends PIXI.Container{

    private score: PIXI.Text;
    private label: string;

    constructor(){
        super();
        this.init();
    }

    private init(){
        this.score = new PIXI.Text(this.label, {
            fontSize: 20,
            fill: 0xfffff00,
        })

        this.addChild(this.score)
    }

    public setScore(score: number){
        this.label = String(score);
    }
}