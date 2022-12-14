import { Game } from "../GameController";
import { BaseGameState } from "./BaseGameState";
import { StartState } from './StartState';

export class LostState extends BaseGameState {

    constructor(controller: Game) {
        super(controller);
    }

    public gameStart(): void {
        this.controllerRef.hideEndScreen();
        const newState: StartState = new StartState(this.controllerRef);
        newState.gameStart();
        this.controllerRef.changeGameState(newState);
    }

    public gameLost(): void {
        this.controllerRef.showEndScreen();
    }
}