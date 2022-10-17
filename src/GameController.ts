import * as PIXI from 'pixi.js'
import { GameObject } from './game/GameObject'
import { BallBehavior } from './game/behavior/BallBehavior'
import { SquareBehavior } from './game/behavior/SquareBehavior'
import { AmmunitionBehavior } from './game/behavior/AmmunitionBehavior';
import { EventDispatcher } from './EventDispatcher';
import { ScoreView } from './views/ScoreView';
import { Model } from './Model';
import { GameApplication } from './GameApplication';
import { EndScreen } from './views/EndScreen';
import { StartScreen } from './views/StartScreen';
import { GameView } from './views/GameView';
import { IGameState } from './states/IGameState';
import { GameEvents } from './GameEvents';
import { EnterState } from './states/EnterState';
import { LostState } from './states/LostState';

export class Game extends PIXI.Container {

    private endScreen: EndScreen;
    private startScreen: StartScreen;
    private gameView: GameView;
    private scoreView: ScoreView;
    private currentState: IGameState;


    private gameObjects: Map<string, GameObject>;
    private ticker: PIXI.Ticker;

    private gameObjContainer: PIXI.Container;
    private uiContainer: PIXI.Container;

    private ammoCount: number = 0;

    constructor() {
        super();
        this.init()
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
        this.gameView.show();
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.NEXT_LEVEL, { level: 1 });
    }

    public showScore() {
        this.scoreView.show();
    }

    public hideScore() {
        this.scoreView.hide();
    }

    public hideGame() {
        this.gameView.hide();
    }


    private init() {
        this.createContainers();
        this.createViews();
        this.resetGame();
        this.setInitialGameState();
        this.addKeyÚpListener();

        //this.createMask();
    }

    private addKeyÚpListener() {
        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener('keyup', this.onKeyUp);
    }

    private setInitialGameState() {
        this.changeGameState(new EnterState(this));
        this.currentState.gameEnter();
    }
    /*private createMask() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xff0000);
        gfx.drawRect(0, 0, 400, 400);
        gfx.endFill();

        const texture1: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        const square: PIXI.Sprite = new PIXI.Sprite(texture1);

        gfx.clear();
        gfx.beginFill(0x0000ff);
        gfx.drawCircle(400, 400, 100);
        gfx.endFill();

        const texture2: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);

        this.gameObjContainer.addChild(square);
        this.gameObjContainer.mask = gfx;
    }
    */

    private createContainers() {
        this.gameObjContainer = new PIXI.Container();
        this.addChild(this.gameObjContainer)

        this.uiContainer = new PIXI.Container;
        this.addChild(this.uiContainer)

        EventDispatcher.getInstance().getDispatcher().on(GameEvents.AMMO_HIT, this.onScoreUpdate, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.METEOR_HIT, this.onScoreHitMeteor, this);
    }

    private createViews() {
        this.gameView = new GameView();
        this.addChild(this.gameView);

        this.scoreView = new ScoreView();
        this.addChild(this.scoreView);

        this.startScreen = new StartScreen();
        this.addChild(this.startScreen);

        this.endScreen = new EndScreen();
        this.addChild(this.endScreen);
    }

    private resetGame() {
        Model.getInstance().resetGame();
        this.scoreView.setScorePlayerOne(Model.getInstance().getScorePlayerOne());
        this.scoreView.setScorePlayerTwo(Model.getInstance().getScorePlayerTwo());
    }

    private calculateScore(n: number) {
        if (n <= 0){
            return 0;
        } else {
            return n
        }
    }

    private onScoreHitMeteor(e: any) {
        if (e.ship.getId() === 'PlayerOne') {
            let currentScore: number = Model.getInstance().getScorePlayerOne() - 2;
            currentScore = this.calculateScore(currentScore);
            Model.getInstance().setScorePlayerOne(currentScore);
            this.scoreView.setScorePlayerOne(Model.getInstance().getScorePlayerOne());
        }
        if (e.ship.getId() === 'PlayerTwo') {
            let currentScore: number = Model.getInstance().getScorePlayerTwo() - 2;
            currentScore = this.calculateScore(currentScore);
            Model.getInstance().setScorePlayerTwo(currentScore);
            this.scoreView.setScorePlayerTwo(Model.getInstance().getScorePlayerTwo());
        }
    }

    private onScoreUpdate(e: any) {
        if (e.hittedobject.getId() === 'PlayerOne') {
            let currentScore: number = Model.getInstance().getScorePlayerTwo() + 1;
            Model.getInstance().setScorePlayerTwo(currentScore);
            this.scoreView.setScorePlayerTwo(Model.getInstance().getScorePlayerTwo());
        }
        if (e.hittedobject.getId() === 'PlayerTwo') {
            let currentScore: number = Model.getInstance().getScorePlayerOne() + 1;
            Model.getInstance().setScorePlayerOne(currentScore);
            this.scoreView.setScorePlayerOne(Model.getInstance().getScorePlayerOne());
        }
    }

    private onKeyUp() {
        if (this.currentState instanceof EnterState ||
            this.currentState instanceof LostState) {
            this.currentState.gameStart();
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.GAME_START);
        }
    }
}