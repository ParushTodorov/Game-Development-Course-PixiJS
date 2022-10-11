import * as PIXI from 'pixi.js'
import { GameObject } from './GameObject'
import { BallBehavior } from './BallBehavior'
import { SquareBehavior } from './SquareBehavior'
import { GameObjectBehavior } from './GameObjectBehavior';
import { Button1 } from './Button1';
import { Button2 } from './Button2';
import { GameApplication } from './GameApplication';
import { AmonitionBahavior } from './AmonitionBahavior';
import { throws } from 'assert';

export class Game extends PIXI.Container {

    private gameObjects: Map<string, GameObject>;
    private ticker: PIXI.Ticker;

    private gameObjContainer: PIXI.Container;
    private uiContainer: PIXI.Container;

    private changeBehaviorButton: Button1;
    private initBehaviorButton: Button2;

    private playerOneShot: boolean = false;
    private playerTwoShot: boolean = false;
    private text: PIXI.Text;

    private ammoCount: number = 0;

    constructor() {
        super();
        this.init()
    }

    private init() {

        this.createTicker();
        this.createGameObjList();
        this.createUiContainer();
        this.createGameObjContainer();
        // this.createButton();
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

    private createBallGameObj() {
        const ballGameObj: GameObject = new GameObject('PlayerOne');

        ballGameObj.x = 100;
        ballGameObj.y = 100;

        this.addGameObject(ballGameObj);
        const ballBehavior: BallBehavior = new BallBehavior(ballGameObj);
        ballGameObj.addBehavior('ball', ballBehavior)
    }

    private creatSquareGameObj() {
        const squareGameObj: GameObject = new GameObject('PlayerTwo');

        squareGameObj.x = 660;
        squareGameObj.y = 100;

        this.addGameObject(squareGameObj);
        const squareBehavior: SquareBehavior = new SquareBehavior(squareGameObj);
        squareGameObj.addBehavior('square', squareBehavior)
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

    private createText(label: string) {
        this.text = new PIXI.Text(label, {
            fontFamily: 'Minecraft',
            fontSize: 100,
            fill: 0xffff00
        })
        this.text.anchor.set(0.5);
        this.text.x = GameApplication.getApp().view.width / 2;
        this.text.y = GameApplication.getApp().view.height / 2;
        this.gameObjContainer.addChild(this.text);

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
        if (gameObj.forDestroy() && gameObj.getId().includes('One')) {
            if (gameObj.killed()) {
                //setscore
            }
            this.deleteGameObj(gameObj.getId());
            this.playerOneShot = false;
            return;
        };
        if (gameObj.forDestroy() && gameObj.getId().includes('Two')) {
            if (gameObj.killed()) {
                //setscore
            }
            this.deleteGameObj(gameObj.getId());
            this.playerTwoShot = false;
            return;
        };
    }

    private update(delta: number) {
        this.gameObjects.forEach((gameObj) => {
            gameObj.update(delta);
            console.log(gameObj.getId())
            if (gameObj.shoot() && gameObj.getId() === 'PlayerOne') {
                this.createAmonition(gameObj);
                this.playerOneShot = true;
            };

            if (gameObj.shoot() && gameObj.getId() === 'PlayerTwo') {
                this.createAmonition(gameObj);
                this.playerTwoShot = true;
            };

            this.shootOnTarget(gameObj);
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