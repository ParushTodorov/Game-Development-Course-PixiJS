import { EventDispatcher } from "./EventDispatcher";
import { GameEvents } from "./GameEvents";

export class Model {

    private scorePlayerOne: number = 0;
    private scorePlayerTwo: number = 0;
    private static instance: Model;

    constructor() {
        this.init();
    }

    private init() {
    }

    public static getInstance(): Model {
        if (!this.instance) {
            this.instance = new Model()
        }

        return this.instance;
    }

    public resetGame() {
        this.scorePlayerOne = 0;
        this.scorePlayerTwo = 0;
    }

    private createBonus(){
        let number: number = (this.scorePlayerOne + this.scorePlayerTwo)/10
        if ( number === Math.floor(number)){
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BONUS_TIME, {n: number})
        }
    }

    public setScorePlayerOne(score: number) {
        this.scorePlayerOne = score;
        this.createBonus();
    }

    public setScorePlayerTwo(score: number) {
        this.scorePlayerTwo = score;
        this.createBonus();
    }

    public getScorePlayerOne(): number {
        return this.scorePlayerOne
    }

    public getScorePlayerTwo(): number {
        return this.scorePlayerTwo
    }
}