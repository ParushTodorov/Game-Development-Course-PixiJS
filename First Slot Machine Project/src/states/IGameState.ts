import { Game } from "../GameController";

export interface IGameState {

    gameStart(): void;

    gameLost(): void;

    gameEnter(): void;
}