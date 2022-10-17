import * as PIXI from 'pixi.js';
import { GameObjectBehavior } from './GameObjectBehavior';
import { GameObject } from '../GameObject';
import { GameApplication } from '../../GameApplication';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';

export class SquareBehavior extends GameObjectBehavior {
    
    private velocity: number = 10;

    private arrowUp: boolean = false;
    private arrowDown: boolean = false;
    private arrowLeft: boolean = false;
    private arrowRight: boolean = false;

    public twoTimesToShoot: boolean = false;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef);
        this.init()
    }

    protected init() {
        this.setKeyCallbackEvent();
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.SET_BONUS, this.setBonus, this)
    }

    private setKeyCallbackEvent() {
        this.onKeyUp = this.onKeyUp.bind(this);
        window.addEventListener('keyup', this.onKeyUp);

        this.onKeyDown = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.onKeyDown);
    }

    public setBonus(e: any) {
        if (e.gameObjId != this.gameObjRef.getId()){
            return;
        }

        console.log(e.gameObjId, e.bonus.getBonusId())

        if (e.bonus.getBonusId() === 'DoubleShoot'){
            this.twoTimesToShoot = true;
            return;
        }
        if (e.bonus.getBonusId() === 'SpeedUP'){
            this.velocity = 15;
            return;
        } 
        this.twoTimesToShoot = false;
        this.velocity = 10;
    }

    private onKeyUp(e: any) {
        if (e.code === 'ArrowUp') {
            this.arrowUp = false;
        }

        if (e.code === 'ArrowDown') {
            this.arrowDown = false;
        }
        if (e.code === 'ArrowLeft') {
            this.arrowLeft = false;
        }
        if (e.code === 'ArrowRight') {
            this.arrowRight = false;
        }
        if (e.code === 'Enter') {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.PLAYER_SHOOT, {player: this.gameObjRef, twoTimesToShoot: this.twoTimesToShoot})
        }
    }

    private onKeyDown(e: any) {
        if (e.code === 'ArrowUp') {
            this.arrowUp = true;
        }

        if (e.code === 'ArrowDown') {
            this.arrowDown = true;
        }
        if (e.code === 'ArrowLeft') {
            this.arrowLeft = true;
        }
        if (e.code === 'ArrowRight') {
            this.arrowRight = true;
        }
    }
    
    public update(delta: number) {
        if (this.arrowUp && this.gameObjRef.y > 0) {
            this.gameObjRef.y -= this.velocity * delta
        }

        if (this.arrowLeft && this.gameObjRef.x > 0) {
            this.gameObjRef.x -= this.velocity * delta
        }

        if (this.arrowRight && this.gameObjRef.x < GameApplication.getApp().view.width - this.gameObjRef.height) {
            this.gameObjRef.x += this.velocity * delta
        }

        if (this.arrowDown && this.gameObjRef.y < GameApplication.getApp().view.height - this.gameObjRef.height) {
            this.gameObjRef.y += this.velocity * delta
        }
    }
}