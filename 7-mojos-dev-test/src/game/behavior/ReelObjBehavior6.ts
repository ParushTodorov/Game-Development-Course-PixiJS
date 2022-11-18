import { Symbol } from '../Symbol';
import {ReelObjBehavior} from './ReelObjBehavior';
import {ReelObjTypes} from '../ReelFactory/ReelObjTypes';

export class ReelObjBehavior6 extends ReelObjBehavior {
    
    protected prize: number;
    public type: ReelObjTypes = ReelObjTypes.TYPE_6;
    protected gameObjRef: Symbol;
    protected isPlaying: boolean;



    constructor(gameObjRef: Symbol) {
        super(gameObjRef);
        this.prize = ReelObjTypes.PRIZES(this.type);
    }
}