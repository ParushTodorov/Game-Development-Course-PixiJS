import * as PIXI from 'pixi.js'
import { GameObject } from './GameObject'
import { BallBehavior } from './BallBehavior'
import { SquareBehavior } from './SquareBehavior'
import { GameObjectBehavior } from './GameObjectBehavior';
import { Button1 } from './Button1';
import { Button2 } from './Button2';
import { GameApplication } from './GameApplication';
import {AmonitionBahavior} from './AmonitionBahavior'
import { throws } from 'assert';

export class Game extends PIXI.Container {

    private gameObjects: Map<string, GameObject>;
    private ticker: PIXI.Ticker;

    private gameObjContainer: PIXI.Container;
    private uiContainer: PIXI.Container;

    private changeBehaviorButton: Button1;
    private initBehaviorButton: Button2;

    constructor() {
        super();
        this.init()
    }

    private init() {
        this.createTicker();
        this.createGameObjList();
        this.createUiContainer();
        this.createGameObjContainer();
        this.createButton();
        this.createGameObj();

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

    private createGameObj() {
        this.createBallGameObj();
        this.creatSquareGameObj();
    }

    private createButton() {
        this.changeBehaviorButton = new Button1('Change behavior');

        this.changeBehaviorButton.x = 400;
        this.changeBehaviorButton.y = GameApplication.getApp().view.height - this.changeBehaviorButton.height - 10;
        this.changeBehaviorButton.getDispatcher().addListener('changebtnup', this.onChangeBtnUp, this);
        this.uiContainer.addChild(this.changeBehaviorButton);

        this.initBehaviorButton = new Button2('Init behavior');

        this.initBehaviorButton.x = 100;
        this.initBehaviorButton.y = GameApplication.getApp().view.height - this.changeBehaviorButton.height - 10;
        this.initBehaviorButton.getDispatcher().addListener('initbtnup', this.onInitBtnnUp, this);
        this.uiContainer.addChild(this.initBehaviorButton)
    }

    private createBallGameObj() {
        const ballGameObj: GameObject = new GameObject('gameObj1');

        ballGameObj.x = 100;
        ballGameObj.y = 100;

        this.addGameObject(ballGameObj);
        const ballBehavior: BallBehavior = new BallBehavior(ballGameObj);
        ballGameObj.addBehavior('ball', ballBehavior)
    }

    private creatSquareGameObj() {
        const squareGameObj: GameObject = new GameObject('gameObj2');

        squareGameObj.x = 500;
        squareGameObj.y = 75;

        this.addGameObject(squareGameObj);
        const squareBehavior: SquareBehavior = new SquareBehavior(squareGameObj);
        squareGameObj.addBehavior('square', squareBehavior)
    }

    private createAmonition() {
        const amonitionBahavior: AmonitionBahavior = new AmonitionBahavior(this.gameObjects.get('gameObj1'), this.gameObjects.get('gameObj1'))
        this.gameObjects.get('gameObj1').addBehavior('amoo', amonitionBahavior)
    }

    private addGameObject(gameObj: GameObject) {
        this.gameObjContainer.addChild(gameObj);
        this.gameObjects.set(gameObj.getId(), gameObj);
    }


    private createTicker() {
        this.ticker = new PIXI.Ticker();
        this.ticker.add(this.update, this);
        this.ticker.start();
    }

    private update(delta: number) {
        this.gameObjects.forEach(gameObj => {
            gameObj.update(delta);

            if(gameObj.shoot){
                this.createAmonition()
                console.log('dasdas')
            }
        })
    }

    private getGameObjByID(id: string): GameObject {
        if (!this.gameObjects.has(id)) {
            return null;
        }

        return this.gameObjects.get(id);
    }

    private onInitBtnnUp() {

    }

    private onChangeBtnUp() {

    }


}