import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { GameSizes } from '../../GameSizes';
import { GameObject } from '../GameObject';
import {RealmObjTypes} from '../RealmFactory/RealmObjTypes';

export class RealmObjBehavior {

    protected prize: number;
    protected gameObjRef: GameObject;
    public type: RealmObjTypes;
    protected isPlaying: boolean;
    protected velocity: number = 7;
    protected isStatic: boolean = true;

    constructor(gameObjRef: GameObject) {
        this.gameObjRef = gameObjRef;
    }

    public getPrice(): number {
        return this.prize;
    }

    public setStatic(){
        this.isStatic = true;
    }

    public startMove(){
        this.isStatic = false;
    }

    public destroy() { }

    public update(delta: number) { 
        if (this.isStatic){
            return;
        }    

        if (this.gameObjRef.y + this.velocity < GameSizes.symbolWidth * 4){
            this.gameObjRef.y += this.velocity * delta;
        } else {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OUT_OF_REALM, {objId: this.gameObjRef.getId()})
        }
    }
}