import * as PIXI from 'pixi.js';
import { EventDispatcher } from './EventDispatcher';
import { AmountView } from './views/AmountView';
import { Model, ModelInfo } from './Model';
import { EndScreen } from './views/EndScreen';
import { StartScreen } from './views/StartScreen';
import { GameView } from './views/GameView';
import { IGameState } from './states/IGameState';
import { GameEvents } from './GameEvents';
import { EnterState } from './states/EnterState';
import { LostState } from './states/LostState';
import { RealmObjTypes } from './game/RealmFactory/RealmObjTypes';

export class Game extends PIXI.Container {

    private endScreen: EndScreen;
    private startScreen: StartScreen;
    private gameView: GameView;
    private amountView: AmountView;
    private currentState: IGameState;

    private gameIsStarted: boolean = false;
    private winningSymbol: RealmObjTypes | null;

    public static BET: number = 0.25;
    public static SYMBOLS_NUMBER: number = 100;
    public static AMOUNT: number = 10;

    constructor() {
        super();
        this.init()
    }

    public changeGameState(newState: IGameState) {
        this.currentState = newState;
    }

    public showStartScreen() {
        this.startScreen.show();
        Game.AMOUNT = 10;
        Game.BET = 0.25;
    }

    public hideStartScreen() {
        this.startScreen.hide();
        Game.AMOUNT = this.startScreen.getAmount();
        Game.BET = this.startScreen.getBet();
        this.amountView.setAmount(Game.AMOUNT);
        Model.getInstance().setAmount(Game.AMOUNT);
    }

    public showEndScreen() {
        this.endScreen.show();
    }

    public hideEndScreen() {
        this.endScreen.hide();
    }

    public showGame() {
        this.gameView.show();
    }

    public showScore() {
        this.amountView.show();
    }

    public hideScore() {
        this.amountView.hide();
    }

    public hideGame() {
        this.gameView.hide();
    }

    private init() {
        this.createViews();
        this.setInitialGameState();
        Model.getInstance().setAmount(Game.AMOUNT);
        this.createDispatchers();
    }

    private createDispatchers(){
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.GAME_START, this.gameStart, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.SET_SPIN, this.setSpinGame, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.STOP_SPIN, this.spinEnd, this);
    }

    private gameStart() {
        if (this.currentState instanceof EnterState ||
            this.currentState instanceof LostState) {
            this.currentState.gameStart();
            
            return;
        }
    }

    private setSpinGame(){
        if (this.gameIsStarted){
            return;
        }

        if (Model.getInstance().getAmount() === 0 || Model.getInstance().getAmount() < Game.BET) {
            return;
        }

        this.gameIsStarted = true;

        Model.getInstance().setGame(Game.BET);

        const amount: number = Model.getInstance().getAmount()

        this.amountView.setAmount(amount)
        
        const modelInfo: ModelInfo = Model.getInstance().getStartGameInfo();
        
        this.gameView.setGame(this.calculateResult(modelInfo))
        
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.START_SPIN)
    }

    private calculateResult(modelInfo: ModelInfo): boolean{
        const rand: number = Math.random();

        if (rand < 0.15){
            this.calculateWinningSymbol();
            Model.getInstance().setWinnersGame(this.winningSymbol)
            return true;
        }

        return false;
    }

    private calculateWinningSymbol(){
        let rand: number = Math.random();

        if (rand <= 0.30) {
            this.winningSymbol = RealmObjTypes.TYPE_1;
        } else if (rand > 0.30 && rand <= 0.50) {
            this.winningSymbol = RealmObjTypes.TYPE_2;
        } else if (rand > 0.50 && rand <= 0.65) {
            this.winningSymbol = RealmObjTypes.TYPE_3;
        } else if (rand > 0.65 && rand <= 0.75) {
            this.winningSymbol = RealmObjTypes.TYPE_4;
        } else if (rand > 0.75 && rand <= 0.84) {
            this.winningSymbol = RealmObjTypes.TYPE_5;
        } else if (rand > 0.84 && rand <= 0.95) {
            this.winningSymbol = RealmObjTypes.TYPE_6;
        } else if (rand > 0.95 && rand <= 0.98) {
            this.winningSymbol = RealmObjTypes.TYPE_7;
        } else {
            this.winningSymbol = RealmObjTypes.TYPE_8;
        }
    }

    private spinEnd(){
        const prize: number = RealmObjTypes.PRIZES(this.winningSymbol);
        let amount: number = Model.getInstance().getAmount();

        amount += prize;

        Model.getInstance().setAmount(amount);
        this.amountView.setAmount(amount);

        if (Model.getInstance().getAmount() === 0 || Model.getInstance().getAmount() < Game.BET) {
            setInterval(() => {
                this.currentState.gameLost();
            }, 3000)
            
            return;
        }

        this.winningSymbol = null;
        Model.getInstance().setWinnersGame(this.winningSymbol);

        this.gameIsStarted = false;
    }

    private setInitialGameState() {
        this.changeGameState(new EnterState(this));
        this.currentState.gameEnter();
    }

    private createViews() {
        this.gameView = new GameView();
        this.addChild(this.gameView);

        this.amountView = new AmountView();
        this.amountView.setAmount(Game.AMOUNT);
        this.addChild(this.amountView);
        

        this.startScreen = new StartScreen();
        this.addChild(this.startScreen);

        this.endScreen = new EndScreen();
        this.addChild(this.endScreen);
    }
}
