import { ReelObjBehavior } from './behavior/reelObjBehavior'
import * as PIXI from 'pixi.js';
import { GameView } from '../views/GameView';
import { Symbol } from './Symbol';
import { EventDispatcher } from '../EventDispatcher';
import { GameEvents } from '../GameEvents';
import {GameApplication} from '../GameApplication';
import { GameSizes } from '../GameSizes';
import { ReelContainer } from './ReelContainer';
import { MotionBlurFilter } from 'pixi-filters';
import { KawaseBlurFilter } from 'pixi-filters';
import { Game } from '../GameController';

export class Reel extends PIXI.Container {

    protected reelContainerRef: ReelContainer;
    protected id: number;
    protected showReelObj: Array <Symbol>;
    private maxVelocity: number = Game.REEL_VELOCITY;
    
    private isStatic: boolean = true;
    
    public reelVelocity: number = 0;
    
    constructor(reelContainerRef: ReelContainer, i: number) {
        super();
        this.reelContainerRef = reelContainerRef;
        this.init(i); 
    }

    protected init(i: number){
        this.showReelObj = [];
        this.setId(i);
        this.createDispatchers();
        this.setRealmObjects()
    }

    private createDispatchers(){
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.OUT_OF_REEL, this.outOfRealm, this)
    }

    public setId(id: number) {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public registerRealmObj(obj: Symbol) {
        obj.getBehavior('reelObjBehavior').setReelRef(this);
        this.addChild(obj);
    }

    public unregisterRealmObj(obj: Symbol) {
        obj.getBehavior('reelObjBehavior').deleteReelRef();
        this.removeChild(obj);
    }

    protected createBackground(i: number) {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.lineStyle(1, 0xffffff, 1)
        gfx.beginFill(0xffffff);
        gfx.drawRect(0, 0, GameSizes.reelWidth, GameSizes.reelHeight);
        gfx.endFill();
        gfx.cacheAsBitmap = true;
        
        gfx.x = GameSizes.reelX + i * GameSizes.reelWidth;
        gfx.y = GameSizes.reelY; 

        this.addChild(gfx)
    }

    public setRealmObjects() {
        for (let i = 3; i >= 0; i--){
            const obj: Symbol = this.reelContainerRef.getSymbol();

            obj.width = GameSizes.symbolWidth;
            obj.height = GameSizes.symbolWidth;
          
            obj.x = GameSizes.reelX + (this.id) * GameSizes.reelWidth;
            obj.y = GameSizes.reelY + i * GameSizes.symbolWidth;
            
            obj.setId('reel' + this.id + 'obj' + i);
            this.registerRealmObj(obj)
            this.showReelObj.push(obj);
        }
    }

    public startMove() {
        if (!this.isStatic){
            return;
        }

        this.isStatic = false;

        this.showReelObj.forEach((obj) => {
            obj.startMove();
        })
    }

    private outOfRealm(e: any){
        if (e.objId != this.showReelObj[0].getId()){
            return;
        }
        
        const oldObject: Symbol = this.showReelObj.shift();

        oldObject.setStatic();

        this.reelContainerRef.setSymbol(oldObject);
        this.unregisterRealmObj(oldObject);

        const obj: Symbol = this.reelContainerRef.getSymbol();
          
        obj.x = GameSizes.reelX + (this.id) * GameSizes.symbolWidth;
        obj.y = GameSizes.reelY;       

        obj.setId('reel' + this.id + 'obj' + 0);
        obj.startMove()
            
        this.registerRealmObj(obj)
        this.showReelObj.push(obj);
    }

    public setStatic(){
        if (this.isStatic) {
            return;
        }

        this.isStatic = true;

        for (let i = 3; i >= 0; i--){
            const obj: Symbol = this.showReelObj.shift();
            
            obj.setStatic();

            obj.x = GameSizes.reelX + (this.id) * GameSizes.reelWidth;
            obj.y = GameSizes.reelY + i * GameSizes.symbolWidth + 10;

            let tick: number = 1;

            for (let yTick = 14; yTick >= 0; yTick--) {
                setTimeout(() => {
                    obj.y = GameSizes.reelY + i * GameSizes.symbolWidth + tick;
                }, 300)
            }

            this.showReelObj.push(obj);
        }
    }

    public getMiddleSymbol(): Array<Symbol> {
        if (!this.showReelObj.slice(0, 3)) {
            return;
        };

        return this.showReelObj.slice(0, 3);
    }

    public update(deltaTime: number) {
        if (!this.isStatic) {
            if (this.reelVelocity < this.maxVelocity) {
                this.reelVelocity += 2;
            } else {
                this.reelVelocity = this.maxVelocity;
            }
        }

        if (this.isStatic) {
            this.reelVelocity = 0
        }

        this.showReelObj.forEach((obj) => {
            obj.update(deltaTime)

            if (this.reelVelocity > this.maxVelocity / 2) {
                (obj.getRenderableById('symbol') as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.ADD;
                obj.filters = [new MotionBlurFilter([5, 80], 15) as unknown as PIXI.Filter, new KawaseBlurFilter([3, 3], 5) as unknown as PIXI.Filter];
            } else {
                (obj.getRenderableById('symbol') as PIXI.Sprite).blendMode = PIXI.BLEND_MODES.NORMAL;
                obj.filters = [];
            }
        })
    }

}

