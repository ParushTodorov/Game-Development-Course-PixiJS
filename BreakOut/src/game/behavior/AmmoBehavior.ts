import { GameObjectBehavior } from './GameObjectBehavior';
import { GameObject } from '../GameObject';
import { GameApplication } from '../../GameApplication';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { BrickType } from '../level/BrickType';

export class AmmoBehavior extends GameObjectBehavior {

    protected gameObjRef: GameObject;
    private hitBrick: boolean = false;
    private velocity: number = 5;
    private direction: string;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef)
        this.gameObjRef = gameObjRef;

        this.init();
    }

    public setDirection(direction: string) {
        this.direction = direction
    }

    
    /*private move(deltaTime: number) {
     
        if (this.direction === 'left' && this.gameObjRef.x > 0 && this.gameObjRef.y > 0) {
            this.gameObjRef.x -= this.velocity * deltaTime * 0.75;
            this.gameObjRef.y -= this.velocity * deltaTime;
            return true;
        }

        if (this.direction === 'right' && this.gameObjRef.x < GameApplication.STAGE_WIDTH && this.gameObjRef.y > 0) {
            this.gameObjRef.x += this.velocity * deltaTime * 0.75;
            this.gameObjRef.y -= this.velocity * deltaTime;
            return true;
        }
        if (this.gameObjRef.y > 0) {
            console.log('IN')
            this.gameObjRef.y -= this.velocity * deltaTime;
            return true;
        }

        return false;
    }*/


    public update(deltaTime: number) {
        
        if (this.gameObjRef.y > 0) {
            this.gameObjRef.y -= this.velocity * deltaTime;
        } else {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJ_DESTROYED, { Id: this.gameObjRef.getId() });
        }
    }
}