import { GameObject } from '../GameObject';
import {RealmObjBehavior} from './RealmObjBehavior'
import {RealmObjTypes} from '../RealmFactory/RealmObjTypes';

export class RealmObjBehavior5 extends RealmObjBehavior {

    protected prize: number;
    public type: RealmObjTypes = RealmObjTypes.TYPE_5;
    protected gameObjRef: GameObject;
    protected isPlaying: boolean;



    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
        this.prize = RealmObjTypes.PRIZES(this.type);
    }

    public destroy() { }

    public update(delta: number) { 
        super.update(delta)
    }
}