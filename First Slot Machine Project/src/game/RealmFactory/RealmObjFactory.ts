import * as PIXI from 'pixi.js'
import {GameObject} from '../GameObject';
import {GameView} from '../../views/GameView';
import {GameApplication} from '../../GameApplication';
import {GameSizes} from '../../GameSizes';
import {RealmObjBehavior1} from '../behavior/RealmObjBehavior1'
import {RealmObjBehavior2} from '../behavior/RealmObjBehavior2'
import {RealmObjBehavior3} from '../behavior/RealmObjBehavior3'
import {RealmObjBehavior4} from '../behavior/RealmObjBehavior4'
import {RealmObjBehavior5} from '../behavior/RealmObjBehavior5'
import {RealmObjBehavior6} from '../behavior/RealmObjBehavior6'
import {RealmObjBehavior7} from '../behavior/RealmObjBehavior7'
import {RealmObjBehavior8} from '../behavior/RealmObjBehavior8'
import { RealmObjTypes } from './RealmObjTypes';
import { Model } from '../../Model';
import { Game } from '../../GameController';

export class RealmObjFactory extends PIXI.Container{

    private symbolsRealm1: Array<GameObject>;
    private symbolsRealm2: Array<GameObject>;
    private symbolsRealm3: Array<GameObject>;

    private gameViewRef: GameView;
    private firstGame: boolean = true;

    private spritesRealmObj: Array<PIXI.Texture>;
    private symbolSize: number;

    private numberOfSymbols: number = 100;

    private winner: boolean;
    private winningSymbol: RealmObjTypes | null;

    constructor(gameViewRef: GameView) {
        super();

        this.gameViewRef = gameViewRef;
        this.init();
    }

    private init() {
        this.spritesRealmObj = [];
        this.setSymbolRealms();
        this.createSprites();
    }

    private setSymbolRealms() {
        this.symbolsRealm1 = [];
        this.symbolsRealm2 = [];
        this.symbolsRealm3 = [];
    }

    public getRealm(number: number) {
        
        switch (number) {
            case 1:
                {
                    //console.log(this.symbolsRealm1);
                    return this.symbolsRealm1;
                }
            case 2:
                {
                    //console.log(this.symbolsRealm2);
                    return this.symbolsRealm2;
                }
            case 3:
                {
                    //console.log(this.symbolsRealm3)
                    return this.symbolsRealm3;
                }
        }
    }

    private createSprites(){
        this.symbolSize = GameSizes.symbolWidth;

        const tileSize = 325;
        
        const texture: PIXI.Texture = PIXI.Texture.from('assets/image/O6YDMD0.jpg');

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const newTexture = new PIXI.Texture(
                    texture.baseTexture,
                    new PIXI.Rectangle(j * tileSize, i * tileSize, tileSize, tileSize));
                
                this.spritesRealmObj.push(newTexture);
            }
        };
    }

    public setGame(winner: boolean){
        console.log(winner)
        if (winner){
            this.winningSymbol = Model.getInstance().getWinnigSymbol();
        };

        this.winner = winner;
        this.setSymbolRealms();
        this.createRealms();
    }

    private createRealms(){
        if (!this.firstGame) {
            this.numberOfSymbols = Game.SYMBOLS_NUMBER
            this.firstGame = false;
        }

        for (let i = 0; i < this.numberOfSymbols; i++){
            this.symbolsRealm1.push(this.createRealmObjLoser(i));
            this.symbolsRealm2.push(this.createRealmObjLoser(i));
            this.symbolsRealm3.push(this.createRealmObjLoser(i));
        }
    }

    private createRealmObjLoser(i: number): GameObject{
        let type: RealmObjTypes = this.createTypeNumber(i);
        
        const symbol: GameObject = this.realmObjFactory(type)
        
        return symbol;
    }

    private createTypeNumber(i: number): RealmObjTypes {
        const rand: number = Math.random();
        let type: RealmObjTypes;

        if (rand <= 0.125) {
            type = RealmObjTypes.TYPE_1;
        } else if (rand > 0.125 && rand <= 0.250) {
            type = RealmObjTypes.TYPE_2;
        } else if (rand > 0.250 && rand <= 0.375) {
            type = RealmObjTypes.TYPE_3;
        } else if (rand > 0.375 && rand <= 0.500) {
            type = RealmObjTypes.TYPE_4;
        } else if (rand > 0.500 && rand <= 0.625) {
            type = RealmObjTypes.TYPE_5;
        } else if (rand > 0.625 && rand <= 0.750) {
            type = RealmObjTypes.TYPE_6;
        } else if (rand > 0.750 && rand <= 0.875) {
            type = RealmObjTypes.TYPE_7;
        } else {
            type = RealmObjTypes.TYPE_8;
        }

        if (i != this.numberOfSymbols - 1) {
            return type;
        }

        if (this.winner) {
            type = this.winningSymbol;
            return type;
        }

        if (!this.symbolsRealm2[i]) {
            return type;
        }

        if(this.symbolsRealm1[i] === this.symbolsRealm2[i] && this.symbolsRealm1[i] === this.symbolsRealm3[i]) {
            type = this.createTypeNumber(i)
        }

        return type;
    }

    private realmObjFactory(type: RealmObjTypes): GameObject {
        const symbol: GameObject = new GameObject(this.gameViewRef);

        switch (type) {
            case RealmObjTypes.TYPE_1:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[0]);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior1: RealmObjBehavior1 = new RealmObjBehavior1(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior1);
                }
                break;
            case RealmObjTypes.TYPE_2:
                {   
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[1]);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior2: RealmObjBehavior2 = new RealmObjBehavior2(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior2);
                }
                break;
            case RealmObjTypes.TYPE_3:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[2]);

                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior3: RealmObjBehavior3 = new RealmObjBehavior3(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior3);
                }
                break;
            case RealmObjTypes.TYPE_4:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[3]);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior4: RealmObjBehavior4 = new RealmObjBehavior4(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior4);
                }
                break;
            case RealmObjTypes.TYPE_5:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[4]);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior5: RealmObjBehavior5 = new RealmObjBehavior5(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior5);
                }
                break;
            case RealmObjTypes.TYPE_6:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[5]);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior6: RealmObjBehavior6 = new RealmObjBehavior6(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior6);
                }
                break;
            case RealmObjTypes.TYPE_7:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[6]);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior7: RealmObjBehavior7 = new RealmObjBehavior7(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior7);
                }
                break;
            case RealmObjTypes.TYPE_8:
                {
                    const sprite: PIXI.Sprite = new PIXI.Sprite(this.spritesRealmObj[7]);
                    
                    sprite.width = this.symbolSize;
                    sprite.height = this.symbolSize;

                    symbol.registerRenderable('symbol', sprite);

                    const realmObjBehavior8: RealmObjBehavior8 = new RealmObjBehavior8(symbol);

                    symbol.setId('symbol' + type);

                    symbol.registerBehavior('realmObjBehavior', realmObjBehavior8);
                }
                break;
        }

        return symbol;
    }

}