import { Game } from "../GameController";
import { BaseGameState } from "./BaseGameState";
import { StartState } from './StartState';

export class EnterState extends BaseGameState {

    constructor(controller: Game) {
        super(controller);
    }

    public gameStart(): void {
        this.controllerRef.hideStartScreen();
        const newState: StartState = new StartState(this.controllerRef);
        newState.gameStart();
        this.controllerRef.changeGameState(newState);
    }

    public gameEnter(): void {
        this.controllerRef.showStartScreen();
    }
}