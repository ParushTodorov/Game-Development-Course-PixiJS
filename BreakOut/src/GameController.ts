import * as PIXI from "pixi.js";
import { EventDispatcher } from "./EventDispatcher";
import { GameView } from "./views/GameView";
import { GameEvents } from "./GameEvents";
import { StartScreen } from "./views/StartScreen";
import { IGameState } from './states/IGameState';
import { EnterState } from "./states/EnterState";
import { ScoreView } from './views/ScoreView';
import { NbrBallView } from './views/NbrBallView';
import { Model } from './Model';
import { BrickType } from './game/level/BrickType';
import { EndScreen } from './views/EndScreen';
import { CounterView } from './views/CounteView'
import { LostState } from "./states/LostState";
import { CollisionManager } from './CollisionManager'

export class GameController extends PIXI.Container {

    private endScreen: EndScreen;
    private startScreen: StartScreen;
    private game: GameView;
    private scoreView: ScoreView;
    private nbrBallView: NbrBallView;
    private counterView: CounterView;
    private currentState: IGameState;
    private gameContainer: PIXI.Container;
    private uiContainer: PIXI.Container;
    public static bonusActivated: boolean = false;

    constructor() {
        super();
        this.init();
    }

    private init() {

        this.createContainers();
        this.createViews();
        this.resetGame();
        this.setInitialGameState();
        this.addKeyÚpListener();

        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BALL_LOST, this.onBallLost, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIDE, this.checkEndOfLevel, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIDE, this.updateScore, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BONUS_TIME, this.setCounter, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BALL_INCR, this.updateNbrBall, this);
    }

    public changeGameState(newState: IGameState) {
        this.currentState = newState;
    }

    public showStartScreen() {
        this.startScreen.show();
    }

    public hideStartScreen() {
        this.startScreen.hide();
    }

    public showEndScreen() {
        this.endScreen.show();
    }

    public hideEndScreen() {
        this.endScreen.hide();
    }

    public showGame() {
        this.game.show();
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.NEXT_LEVEL, { level: 1 });

    }

    public showScore() {
        this.scoreView.show();
        //EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIT, this.brickHit, this)
    }

    public hideScore() {
        this.scoreView.hide();
    }

    public showCounterView() {
        this.counterView.show();
    }

    public hideCounterView() {
        this.counterView.hide();
    }

    public showNbrBall() {
        this.nbrBallView.show();
    }

    public hideNbrBall() {
        this.nbrBallView.hide();
    }

    public hideGame() {
        this.game.hide();
    }

    private addKeyÚpListener() {
        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener('keyup', this.onKeyUp);
    }

    private setInitialGameState() {
        this.changeGameState(new EnterState(this));
        this.currentState.gameEnter();
    }

    private createContainers() {
        this.uiContainer = new PIXI.Container();
        this.gameContainer = new PIXI.Container();

        this.addChild(this.uiContainer);
        this.addChild(this.gameContainer);
    }

    private createViews() {
        this.game = new GameView();
        this.addChild(this.game);

        this.scoreView = new ScoreView();
        this.addChild(this.scoreView);

        this.counterView = new CounterView();
        this.addChild(this.counterView);

        this.nbrBallView = new NbrBallView();
        this.addChild(this.nbrBallView);

        this.startScreen = new StartScreen();
        this.addChild(this.startScreen);

        this.endScreen = new EndScreen();
        this.addChild(this.endScreen);
    }

    private resetGame() {
        Model.getInstance().resetGame();
        this.scoreView.setScore(Model.getInstance().getScore());
        this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall());
    }

    private updateScore(e: any) {
        const brickType = e.brickType;

        switch (brickType) {
            case BrickType.TYPE_1:
                Model.getInstance().addScore(1);
                break;
            case BrickType.TYPE_2:
                Model.getInstance().addScore(3);
                break;
            case BrickType.TYPE_3:
                Model.getInstance().addScore(5);
                break;
            case BrickType.TYPE_4:
                Model.getInstance().addScore(1);
                break;
            case BrickType.TYPE_5:
                Model.getInstance().addScore(1);
                break;
            case BrickType.TYPE_6:
                Model.getInstance().addScore(5);
                break;
            case BrickType.TYPE_7:
                Model.getInstance().addScore(3);
                break;
        }

        this.scoreView.setScore(Model.getInstance().getScore());
    }

    private updateNbrBall() {
        Model.getInstance().incrementNbrBall();
        this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall());
    }

    private checkEndOfLevel(e: any) {
        if (e.brickType != BrickType.TYPE_6) {
            Model.getInstance().decrementTotalNbrBrick();
            ;
        }

        if (Model.getInstance().getTotalNbrBrick() <= 0) {
            Model.getInstance().incrementLevel();
            this.updateNbrBall();
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.NEXT_LEVEL, { level: Model.getInstance().getCurrentLevel() });
        }
    }

    private onKeyUp() {
        if (this.currentState instanceof EnterState ||
            this.currentState instanceof LostState) {
            this.currentState.gameStart();
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.GAME_START);
        }
    }

    private onBallLost() {
        Model.getInstance().decrementNbrBall();
        if (Model.getInstance().getTotalNbrBall() <= 0) {
            this.resetGame();
            this.game.clearCurrentLevel();
            this.currentState.gameLost();
        }
        this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall())
    }

    private setCounter(e: any) {
        this.counterView.setCounts(e.time);
    }

    /*private brickHit(e: any) {
        if (GameController.bonusActivated) {
            return;
        }

        let time: number = 0;

        if (e.brickType === BrickType.TYPE_3) {
            time = 5000;
        };

        if (e.brickType === BrickType.TYPE_4) {
            time = 15000;
        };

        if (time === 0) {
            return;
        };

        GameController.bonusActivated = true;
        this.counterView.setCounts(time);
        setTimeout(() => {
            GameController.bonusActivated = false
        }, time);
    }*/
}