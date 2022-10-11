import * as PIXI from 'pixi.js'
import { GameObject } from './GameObject'
import { BallBehavior } from './BallBehavior'
import { SquareBehavior } from './SquareBehavior'
import { GameApplication } from './GameApplication';
import { AmonitionBahavior } from './AmonitionBahavior';
import { EventDispatcher } from './EventDispatcher';
import { ScoreView } from './ScoreView';
import { Model } from './Model'

export class Game extends PIXI.Container {

    private gameObjects: Map<string, GameObject>;
    private ticker: PIXI.Ticker;

    private gameObjContainer: PIXI.Container;
    private uiContainer: PIXI.Container;

    private ammoCount: number = 0;
    private text: PIXI.Text;



    private scoreView: ScoreView;

    constructor() {
        super();
        this.init()
    }

    private init() {

        this.createTicker();
        this.createGameObjList();
        this.createUiContainer();
        this.createGameObjContainer();
        this.createGameObj();
        this.createScoreView()
    }

    private createGameObjList() {
        this.gameObjects = new Map<string, GameObject>();
    }

    private createGameObjContainer() {
        this.gameObjContainer = new PIXI.Container();
        this.addChild(this.gameObjContainer)
    }

    private createUiContainer() {
        this.uiContainer = new PIXI.Container;
        this.addChild(this.uiContainer)
    }

    private createScoreView() {
        this.scoreView = new ScoreView(0, 0);
        this.scoreView.x = 50;
        this.scoreView.y = 10;
        this.uiContainer.addChild(this.scoreView)
    }

    private createGameObj() {
        this.createBallGameObj();
        this.creatSquareGameObj();
    }

    private createBallGameObj() {
        const ballGameObj: GameObject = new GameObject('PlayerOne');

        ballGameObj.x = 100;
        ballGameObj.y = 100;

        this.addGameObject(ballGameObj);
        const ballBehavior: BallBehavior = new BallBehavior(ballGameObj);
        ballGameObj.addBehavior('ball', ballBehavior)

        EventDispatcher.getInstance().getDispatcher().addListener('ballHit', this.onScoreSquareUpdate, this)
    }

    private creatSquareGameObj() {
        const squareGameObj: GameObject = new GameObject('PlayerTwo');

        squareGameObj.x = 660;
        squareGameObj.y = 100;

        this.addGameObject(squareGameObj);
        const squareBehavior: SquareBehavior = new SquareBehavior(squareGameObj);
        squareGameObj.addBehavior('square', squareBehavior)

        EventDispatcher.getInstance().getDispatcher().addListener('squareHit', this.onScoreBallUpdate, this)
    }

    private onScoreBallUpdate() {
        let currentScore: number = Model.getIstance().getScorePlayerOne() + 1;
        Model.getIstance().setScorePlayerOne(currentScore);
        this.scoreView.setScorePlayerOne(Model.getIstance().getScorePlayerOne());
    }

    private onScoreSquareUpdate() {
        let currentScore: number = Model.getIstance().getScorePlayerTwo() + 1;
        Model.getIstance().setScorePlayerTwo(currentScore);
        this.scoreView.setScorePlayerTow(Model.getIstance().getScorePlayerTwo());
    }

    private createAmonition(gameObj: GameObject) {
        let enemy: GameObject;
        let name: string;
        let x: number;

        if (gameObj.getId() === 'PlayerOne') {
            enemy = this.gameObjects.get('PlayerTwo');
            name = `AmoPlayerOne${this.ammoCount}`;
            x = gameObj.x + gameObj.width
        } else {
            enemy = this.gameObjects.get('PlayerOne');
            name = `AmoPlayerTwo${this.ammoCount}`;
            x = gameObj.x
        }
        const amoGameObj: GameObject = new GameObject(name);


        amoGameObj.x = x;
        amoGameObj.y = gameObj.y + gameObj.height / 2;

        this.addGameObject(amoGameObj);

        const amonitionBahavior: AmonitionBahavior = new AmonitionBahavior(amoGameObj, gameObj, enemy)
        this.gameObjects.get(name).addBehavior('amoo', amonitionBahavior)
        this.ammoCount += 1
    }

    private addGameObject(gameObj: GameObject) {
        this.gameObjContainer.addChild(gameObj);
        this.gameObjects.set(gameObj.getId(), gameObj);
    }

    private deleteGameObj(id: string) {
        if (!this.gameObjects.has(id)) {
            return;
        }
        this.gameObjects.get(id).destroy({ texture: true, baseTexture: true });
        this.gameObjContainer.removeChild(this.gameObjects.get(id));
        this.gameObjects.delete(id);
    }

    private createTicker() {
        this.ticker = new PIXI.Ticker();
        this.ticker.add(this.update, this);
        this.ticker.start();
    }

    private shootOnTarget(gameObj: GameObject) {
        if (!gameObj.getId().includes('Amo')) {
            return;
        };
        
        if (gameObj.forDestroy()) {
            this.deleteGameObj(gameObj.getId());
        };
    }

    private update(delta: number) {
        this.gameObjects.forEach((gameObj) => {
            gameObj.update(delta);
            if (gameObj.shoot() && gameObj.getId() === 'PlayerOne') {
                this.createAmonition(gameObj);
            };

            if (gameObj.shoot() && gameObj.getId() === 'PlayerTwo') {
                this.createAmonition(gameObj);
            };

            this.shootOnTarget(gameObj);
        })
    }
}