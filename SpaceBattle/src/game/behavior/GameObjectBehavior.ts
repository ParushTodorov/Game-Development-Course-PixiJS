import { GameObject } from '../GameObject';

export class GameObjectBehavior {

    protected gameObjRef: GameObject;

    protected static instance: GameObjectBehavior;

    constructor(gameObjRef: GameObject) {
        this.gameObjRef = gameObjRef;
    }

    public static getInstansce(gameObj: GameObject): GameObjectBehavior {
        return new this(gameObj)
    }

    public setEnemy(gameObj: GameObject) { }

    public setBonus(bounsId: string) { }

    public destroy() { }

    public update(delta: number) { }
}