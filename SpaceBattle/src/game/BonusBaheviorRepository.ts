import { GameObjectBehavior } from './behavior/GameObjectBehavior'
import { GameObject } from './GameObject'
import * as PIXI from 'pixi.js';
import { GameApplication } from '../GameApplication';
import { EventDispatcher } from '../EventDispatcher';
import { BonusBehaviorDoubleShoot } from './behavior/bonus/BonusBehaviorDoubleShoot';
import { Class } from '@swc/core';
import { BonusBehaviorSpeedUP } from './behavior/bonus/BonusBehaviorSpeedUP'

export class BonusBaheviorRepository extends GameObjectBehavior {
    
    private pulse = false;

    private bonusList = [BonusBehaviorDoubleShoot, BonusBehaviorSpeedUP];

    constructor(gameObj: GameObject) {
        super(gameObj)
    }

    protected init() { }

    public getBehavior(gameObj: GameObject) {
        const index: number = Math.floor(this.bonusList.length * Math.random())
        return this.bonusList[index].getInstansce(gameObj)
    }

    public update(delta: number){
 
    }
}