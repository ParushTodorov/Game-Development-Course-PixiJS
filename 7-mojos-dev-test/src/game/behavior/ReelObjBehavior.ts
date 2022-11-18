import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { GameSizes } from '../../GameSizes';
import { Symbol } from '../Symbol';
import { Reel } from '../Reel';
import {ReelObjTypes} from '../ReelFactory/ReelObjTypes';

export class ReelObjBehavior {

    protected prize: number;
    protected gameObjRef: Symbol;
    public type: ReelObjTypes;
    protected velocity: number = 50;
    protected isStatic: boolean = true;
    protected reelRef: Reel;

    constructor(gameObjRef: Symbol) {
        this.gameObjRef = gameObjRef;
    }

    public setReelRef(reel: Reel) {
        this.reelRef = reel;
    }

    public deleteReelRef() {
        this.reelRef = null;
    }
    
    public startMove(){
        this.isStatic = false;
    }

    public setStatic(){
        this.isStatic = true;
    }

    public getPrice(): number {
        return this.prize;
    }

    public destroy() { }

    public update(delta: number) { 
        this.velocity = this.reelRef.reelVelocity;

        if (!this.isStatic){
            if (this.gameObjRef.y + this.velocity < GameSizes.symbolWidth * 5){
                this.gameObjRef.y += this.velocity;
            } else {
                EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OUT_OF_REEL, {objId: this.gameObjRef.getId()})
            }
        }
        if (this.isStatic) {
            this.gameObjRef.y += this.velocity
        }
    }
}