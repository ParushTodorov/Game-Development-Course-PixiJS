import { Game } from "../GameController";
import { IGameState } from "./IGameState";

export class BaseGameState implements IGameState {

    protected controllerRef: Game;

    constructor(controller: Game) {
        this.controllerRef = controller;
    }

    public gameStart(): void { }

    public gamerEnd(): void { }

    public gameLost(): void { }

    public gameEnter(): void { }
}