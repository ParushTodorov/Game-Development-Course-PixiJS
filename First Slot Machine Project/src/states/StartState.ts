import { Game } from "../GameController";
import { Model } from "../Model";
import { BaseGameState } from "./BaseGameState";
import { LostState } from './LostState';

export class StartState extends BaseGameState {

    constructor(controller: Game) {
        super(controller);
    }

    public gameStart(): void {
        this.controllerRef.showGame();
        this.controllerRef.showScore();
    }

    public gameLost(): void {
        this.controllerRef.hideGame();
        this.controllerRef.hideScore();
        const newState: LostState = new LostState(this.controllerRef);
        newState.gameLost();
        this.controllerRef.changeGameState(newState);
    }
}