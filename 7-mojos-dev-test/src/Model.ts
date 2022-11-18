import { EventDispatcher } from "./EventDispatcher";
import { ReelObjTypes } from "./game/ReelFactory/ReelObjTypes";
import { GameEvents } from "./GameEvents";


export class Model {

    private static instance: Model;

    private amount: number;

    constructor() {
        this.init();
    }

    private init() {
        this.amount = 0;
    }

    public setAmount(amount: number) {
        this.amount = amount;
    }

    public getAmount() {
        return this.amount;
    }

    public static getInstance(): Model {
        if (!this.instance) {
            this.instance = new Model()
        }

        return this.instance;
    }

    public setGame(bet: number) {
        this.amount -= bet;
    }
}