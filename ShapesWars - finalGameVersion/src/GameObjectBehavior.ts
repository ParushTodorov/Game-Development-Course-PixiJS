import { GameObject } from './GameObject'

export class GameObjectBehavior {

    protected gameObjRef: GameObject;
    protected isShooted: boolean = false;
    protected isForDestroy: boolean = false;
    protected isKilled: boolean = false;

    constructor(gameObjRef: GameObject) {
        this.gameObjRef = gameObjRef;
        this.init();
    }

    public destroy() { }

    public forDestroy(): boolean {
        return this.isForDestroy;
    }

    public setHit() { }

    public killed() {
        return this.isKilled;
    }

    public shoot(): boolean {
        return this.isShooted;
    }

    protected init() { }

    public update(delta: number) { }
}