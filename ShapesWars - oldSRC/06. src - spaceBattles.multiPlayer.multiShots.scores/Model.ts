export class Model {

    private scorePlayerOne: number = 0;
    private scorePlayerTwo: number = 0;
    private static instance: Model;

    constructor() {
        this.init();
    }

    private init() {
    }

    public static getIstance(): Model {
        if (!this.instance) {
            this.instance = new Model()
        }

        return this.instance;
    }

    public setScorePlayerOne(score: number) {
        this.scorePlayerOne = score
    }

    public setScorePlayerTwo(score: number) {
        this.scorePlayerTwo = score
    }

    public getScorePlayerOne(): number {
        return this.scorePlayerOne
    }

    public getScorePlayerTwo(): number {
        return this.scorePlayerTwo
    }
}