import * as PIXI from 'pixi.js';
import { Symbol } from '../Symbol';
import {GameView} from '../../views/GameView';
import {GameSizes} from '../../GameSizes';
import {ReelObjBehavior1} from '../behavior/ReelObjBehavior1';
import {ReelObjBehavior2} from '../behavior/ReelObjBehavior2';
import {ReelObjBehavior3} from '../behavior/ReelObjBehavior3';
import {ReelObjBehavior4} from '../behavior/ReelObjBehavior4';
import {ReelObjBehavior5} from '../behavior/ReelObjBehavior5';
import {ReelObjBehavior6} from '../behavior/ReelObjBehavior6';
import {ReelObjBehavior7} from '../behavior/ReelObjBehavior7';
import {ReelObjBehavior8} from '../behavior/ReelObjBehavior8';
import { ReelObjTypes } from './ReelObjTypes';
import { ReelSymbolTypes } from './ReelSymbolTypes';
import { Game } from '../../GameController';

export class ReelObjFactory extends PIXI.Container{

    private gameViewRef: GameView;
    private symbolsReel: Array<Symbol>;

    private symbolSize: number;
    private numberOfSymbols: number = Game.LEN_OF_SYMBOLS_ARRAY;

    constructor(gameViewRef: GameView) {
        super();

        this.gameViewRef = gameViewRef;
        this.init();
    }

    private init() {
        this.symbolsReel = [];
        this.symbolSize = GameSizes.symbolWidth;
    }

    public getReel(): Array<Symbol> {
        this.symbolsReel = [];

        this.createReels();

        return this.symbolsReel;
    }

    private createReels(){
        for (let i = 0; i < this.numberOfSymbols; i++){
            this.symbolsReel.push(this.createReelObj(i));
        }
    }

    private createReelObj(i: number): Symbol{
        const rand: number = Math.random();
        let type: ReelObjTypes;

        if (rand <= 0.125) {
            type = ReelObjTypes.TYPE_1;
        } else if (rand > 0.125 && rand <= 0.250) {
            type = ReelObjTypes.TYPE_2;
        } else if (rand > 0.250 && rand <= 0.375) {
            type = ReelObjTypes.TYPE_3;
        } else if (rand > 0.375 && rand <= 0.500) {
            type = ReelObjTypes.TYPE_4;
        } else if (rand > 0.500 && rand <= 0.625) {
            type = ReelObjTypes.TYPE_5;
        } else if (rand > 0.625 && rand <= 0.750) {
            type = ReelObjTypes.TYPE_6;
        } else if (rand > 0.750 && rand <= 0.875) {
            type = ReelObjTypes.TYPE_7;
        } else {
            type = ReelObjTypes.TYPE_8;
        }
        
        const symbol: Symbol = this.symbolFactory(type)
        
        return symbol;
    }

    private symbolFactory(type: ReelObjTypes): Symbol {
        const symbol: Symbol = new Symbol(this.gameViewRef);

        switch (type) {
            case ReelObjTypes.TYPE_1:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_1);

                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior1: ReelObjBehavior1 = new ReelObjBehavior1(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior1);
                }
                break;
            case ReelObjTypes.TYPE_2:
                {   
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_2);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior2: ReelObjBehavior2 = new ReelObjBehavior2(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior2);
                }
                break;
            case ReelObjTypes.TYPE_3:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_3);

                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior3: ReelObjBehavior3 = new ReelObjBehavior3(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior3);
                }
                break;
            case ReelObjTypes.TYPE_4:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_4);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior4: ReelObjBehavior4 = new ReelObjBehavior4(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior4);
                }
                break;
            case ReelObjTypes.TYPE_5:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_5);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior5: ReelObjBehavior5 = new ReelObjBehavior5(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior5);
                }
                break;
            case ReelObjTypes.TYPE_6:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_6);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior6: ReelObjBehavior6 = new ReelObjBehavior6(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior6);
                }
                break;
            case ReelObjTypes.TYPE_7:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_7);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior7: ReelObjBehavior7 = new ReelObjBehavior7(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior7);
                }
                break;
            case ReelObjTypes.TYPE_8:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(ReelSymbolTypes.TYPE_8);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const reelObjBehavior8: ReelObjBehavior8 = new ReelObjBehavior8(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('reelObjBehavior', reelObjBehavior8);
                }
                break;
        }

        return symbol;
    }

}