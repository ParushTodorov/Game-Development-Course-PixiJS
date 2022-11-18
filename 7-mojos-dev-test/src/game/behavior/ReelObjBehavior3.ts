import { Symbol } from '../Symbol';
import {ReelObjBehavior} from './ReelObjBehavior';
import {ReelObjTypes} from '../ReelFactory/ReelObjTypes';

export class ReelObjBehavior3 extends ReelObjBehavior {
    
    protected prize: number;
    public type: ReelObjTypes = ReelObjTypes.TYPE_3;
    protected gameObjRef: Symbol;
    protected isPlaying: boolean;



    constructor(gameObjRef: Symbol) {
        super(gameObjRef);
        this.prize = ReelObjTypes.PRIZES(this.type);
    }
}