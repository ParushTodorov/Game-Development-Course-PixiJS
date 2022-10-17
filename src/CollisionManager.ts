import * as PIXI from 'pixi.js';
import { GameObject } from './game/GameObject'
import { EventDispatcher } from './EventDispatcher'
import { GameEvents } from './GameEvents'

export class CollisionManager {
    private objectList: Array<GameObject> = [];
    private playerOne: GameObject;
    private playerTwo: GameObject;

    constructor() {
        this.init()
    }

    private init() { }

    public registerObject(gameObj: GameObject) {
        this.objectList.push(gameObj);
    }

    public registerPlayerOne(gameObj: GameObject) {
        this.playerOne = gameObj;
    }

    public registerPlayerTwo(gameObj: GameObject) {
        this.playerTwo = gameObj;
    }

    public unregisterObject(id: string) {
        for (let i = this.objectList.length - 1; i >= 0; i--) {

            if (this.objectList[i].getId() != id) {
                continue;
            }
            this.objectList.splice(i, 1);
            break
        }
    }

    public update() {
        const playerOneReck: PIXI.Rectangle = new PIXI.Rectangle(this.playerOne.x + 10, this.playerOne.y + 35, this.playerOne.width - 10, this.playerOne.height - 35);
        const playerTwoReck: PIXI.Rectangle = new PIXI.Rectangle(this.playerTwo.x + 10, this.playerTwo.y + 35, this.playerTwo.width - 10, this.playerTwo.height - 35);

        if (this.hitTestRectangle(playerOneReck, playerTwoReck)) {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SHIPS_HIT, { playerOne: this.playerOne, playerTwo: this.playerTwo });
        }

        if (this.objectList.length === 0) {
            return;
        }

        this.objectList.forEach((gameObj) => {

            const gameObjReck: PIXI.Rectangle = new PIXI.Rectangle(gameObj.x, gameObj.y, gameObj.width, gameObj.height);

            /*if ((gameObjReck.left <= playerOneReck.right &&
                playerOneReck.left <= gameObjReck.right &&
                gameObjReck.top <= playerOneReck.bottom &&
                playerOneReck.top <= gameObjReck.bottom)) {
*/
            if (this.hitTestRectangle(gameObjReck, playerOneReck)) {
                EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJECT_HIT, { gameObj: gameObj, ship: this.playerOne });
            }
            if (this.hitTestRectangle(gameObjReck, playerTwoReck)) {
                EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJECT_HIT, { gameObj: gameObj, ship: this.playerTwo });
            }
        })
    }

    private hitTestRectangle(a: PIXI.Rectangle, b: PIXI.Rectangle):boolean {
        if (!(a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom)) {
                return false;
            }

        return true;

    }
}