export class Model {

    private score: number = 0;

    constructor() {
        this.init();
    }

    private init() {

    }

    public setScore(score: number) {
        this.score = score
    }

    public getScore(): number {
        return this.score
    }
}