import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';
import { GameObject } from '../GameObject';
import {RealmObjTypes} from '../RealmFactory/RealmObjTypes';
import * as PIXI from 'pixi.js';

export class ButtonBehavior {

    protected gameObjRef: GameObject;
    protected isClicked: boolean = false

    constructor(gameObjRef: GameObject) {
        this.gameObjRef = gameObjRef;
        
        this.createListener();
    }

    private createListener(){
        const renderable: PIXI.Graphics = (this.gameObjRef.getRenderableById('buttonImg') as PIXI.Graphics)
        renderable.interactive = true;
        renderable.buttonMode = true;
        renderable.on("pointerdown", this.onClick, this);
    }


    private onClick(){
        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SET_SPIN)
    }

    public destroy() { }

    public update(delta: number) { 

    }
}