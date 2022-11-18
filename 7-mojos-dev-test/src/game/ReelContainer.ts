import { ReelObjBehavior } from './behavior/reelObjBehavior'
import * as PIXI from 'pixi.js';
import { GameView } from '../views/GameView';
import { Symbol } from './Symbol';
import { EventDispatcher } from '../EventDispatcher';
import { GameEvents } from '../GameEvents';
import { GameApplication } from '../GameApplication';
import { GameSizes } from '../GameSizes';
import { Reel } from './Reel';
import { ReelObjFactory } from './ReelFactory/ReelObjFactory';
import { Game } from '../GameController';

export class ReelContainer extends PIXI.Container {

    private gameViewRef: GameView;
    private reelObjFactory: ReelObjFactory;

    private reels: Map<number, Reel>;
    private symbols: Array<Symbol>;
    private endSymbols: Array<Array<Symbol>>;

    private gameOn: boolean = false;
    private stateReelSpinningClick: Array<number>;
    private stateReelSpinningSwipe: Array<number>;

    private countGetSymbol: number = 0;
    private symbolsToRotate: number = Game.OBJECT_ROTATED

    constructor(gameViewRef: GameView) {
        super();
        this.gameViewRef = gameViewRef;
        this.init();
    }

    protected init() {
        this.reels = new Map<number, Reel>();
        this.endSymbols = [];
        this.stateReelSpinningClick = [];
        this.stateReelSpinningSwipe = [];
        this.reelObjFactory = new ReelObjFactory(this.gameViewRef)
        this.createmask();
        this.createReels();
    }

    private createmask() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();

        gfx.beginFill(0x0000ff);
        gfx.drawRect(GameSizes.maskX, GameSizes.maskY, GameSizes.maskWidth, GameSizes.maskHeight);
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        this.mask = gfx;
    }

    private createSymbols() {
        if (this.symbols) {
            this.symbols.forEach((obj) => {
                obj.destroy();
            })
        }
        
        this.symbols = this.reelObjFactory.getReel()
    }

    private createReels() {
        this.createSymbols();

        for (let i=0; i < 5; i++) {
            const reel: Reel = new Reel(this, i);
            reel.setId(i);
            this.stateReelSpinningClick.push(0);
            this.stateReelSpinningSwipe.push(0);
            reel.interactive = true;
            reel.on("pointerdown", () => {this.onClick(i)}, this);
            reel.on("mouseover", (e) => {this.mouseOver(i, e)}, this);
            
            this.reels.set(i, reel);
            this.addChild(reel);
        }
    }

    public getSymbol(): Symbol {
        this.countGetSymbol++;
        return this.symbols.shift()
    }

    public setSymbol(symbol: Symbol) {
        this.symbols.push(symbol);
    }

    private onClick(i: number) { 
        this.reelStopSpin(i);

        if(this.checkForEndOfSpinning(this.stateReelSpinningClick) && this.gameOn){
            this.endSpin();
        }
    }

    private mouseOver(i: number, e: any) {
        if (!this.gameOn){
            return;
        }

        this.stateReelSpinningSwipe[i] = 0;
        setTimeout(() => {
            if (this.checkForEndOfSpinning(this.stateReelSpinningSwipe) && this.gameOn) {
                this.endSpin();
            } 
        }, 100)
    }   

    private checkForEndOfSpinning(array: Array<Number>): boolean{ 
        if (!this.gameOn) {
            return;
        }

        let isEquals: boolean = true;

        for (let i=0; i < 5; i++){
            if (array[i]) {
                isEquals = false;
                break;
            }
        }
        
        return isEquals;
    }

    public startSpin() {
        if(this.gameOn) {
            return;
        }

        this.createSymbols();

        this.gameOn = true;
        this.countGetSymbol = 0;
    
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const reel: Reel = this.reels.get(i);
                reel.startMove();
                this.stateReelSpinningClick[i] = 1;
                this.stateReelSpinningSwipe[i] = 1;
            }, 100 * i)
        }
    }

    private endSpin() {
        if (!this.gameOn) {
            return;
        }

        this.gameOn = false;

        this.countGetSymbol = 0;   
        this.endSymbols = []

        for (let i = 0; i < 5; i++) {
            this.stateReelSpinningSwipe[i] = 0
            
            setTimeout(() => {
                this.reelStopSpin(i);

                setTimeout(() => {
                    const reelEndSymbols: Array<Symbol> = this.reels.get(i).getMiddleSymbol();
                    this.endSymbols.push(reelEndSymbols);  
                }, 100)
            }, 100 * i)   
        }

        setTimeout(() => {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.STOP_SPIN, {array: this.endSymbols });
            
        }, 800)
    }

    private reelStopSpin(i: number) {
        const reel: Reel = this.reels.get(i);
        this.stateReelSpinningClick[i] = 0;
        reel.setStatic();         
    }

    public update(deltaTime: number) {
        this.reels.forEach((reel) => {
            reel.update(deltaTime)
        })

        if (this.countGetSymbol >= this.symbolsToRotate && this.gameOn) {
            this.endSpin();
        }
    }
}