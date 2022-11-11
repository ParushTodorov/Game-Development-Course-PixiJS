import { RealmObjBehavior } from './behavior/RealmObjBehavior'
import * as PIXI from 'pixi.js';
import { GameView } from '../views/GameView';
import { GameObject } from './GameObject';
import { EventDispatcher } from '../EventDispatcher';
import { GameEvents } from '../GameEvents';
import {GameApplication} from '../GameApplication';
import { GameSizes } from '../GameSizes';


export class Realm extends PIXI.Container {

    protected gameViewRef: GameView;
    protected realmObjects: Array<GameObject>
    protected active: boolean = false;
    protected id: number;
    protected showRealmObj: Array <GameObject>;
    protected realmX: number;
    protected realmY: number;
    
    constructor(gameViewRef: GameView, i: number) {
        super();
        this.gameViewRef = gameViewRef;
        this.init(i);
        
    }

    protected init(i: number){
        this.realmObjects = [];
        this.showRealmObj = [];
        this.realmX = 250 + i * 100;
        this.realmY = 50;
        this.createMask(i);
        this.createDispatchers();
    }

    private createDispatchers(){
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.OUT_OF_REALM, this.outOfRealm, this)
    }

    public setId(id: number) {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public activate() {
        this.active = true;
    }

    public deactivate() {
        this.active = false;
    }

    public registerRealmObj(id:string, gameObj: GameObject) {
        this.gameViewRef.registerGameObj(id, gameObj);
        this.addChild(gameObj);
    }

    public unregisterRealmObj(id:string) {
        const gameObject: Realm | GameObject= this.gameViewRef.getObjById(id);
        if (!gameObject) {
            console.warn("unregisterGameObject() " + id + " does not exist");
            return;
        }

        this.gameViewRef.unregisterObj(id);
        this.removeChild(gameObject);
    }

    protected createBackground(i: number) {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.lineStyle(1, 0xffffff, 1)
        gfx.beginFill(0xffffff);
        gfx.drawRect(0, 0, GameSizes.realmWidth, GameSizes.realmHeight);
        gfx.endFill();
        gfx.cacheAsBitmap = true;
        
        gfx.x = GameSizes.realmX + i * GameSizes.realmWidth;
        gfx.y = GameSizes.realmY; 

        this.addChild(gfx)
    }

    private createMask(i: number) {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        
        gfx.beginFill(0x0000ff);
        gfx.drawRoundedRect(0, 0, GameSizes.maskWidth, GameSizes.maskHeight, 15);
        gfx.endFill();

        gfx.x = GameSizes.maskX + i * GameSizes.maskWidth;
        gfx.y = GameSizes.maskY;

        const texture2: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);

        this.mask = gfx;
    }

    public setRealmObjects(array: Array<GameObject>) {
        this.realmObjects = array;
        if(this.showRealmObj.length != 0){
            return;
        }

        this.setSymbols()
    }

    private setSymbols() {
        for (let i = 3; i >= 0; i--){
            const obj: GameObject = this.realmObjects.shift();
          
            obj.x = GameSizes.realmX + (this.id - 1) * GameSizes.realmWidth + GameSizes.realmBorder;
            obj.y = GameSizes.symbolY + i * GameSizes.symbolWidth;
            
            this.registerRealmObj('obj' + this.id + i, obj)
            this.showRealmObj.push(obj);
        }
    }

    private outOfRealm(e: any){
        if (e.objId != this.showRealmObj[0].getId()){
            return;
        }
        const oldObject: GameObject = this.showRealmObj.shift();

        this.realmObjects.push(oldObject);

        this.unregisterRealmObj(oldObject.getId());

        const obj: GameObject = this.realmObjects.shift();
          
        obj.x = GameSizes.symbolX + (this.id - 1) * GameSizes.realmWidth;
        obj.y = GameSizes.symbolY;
        obj.startMove()
            
        this.registerRealmObj(e.objId, obj)
        
        this.showRealmObj.push(obj);
    }

    public setStatic(){
        for (let i = 3; i >= 0; i--){
            const obj: GameObject = this.showRealmObj.shift();
            
            obj.setStatic();

            obj.x = GameSizes.symbolX + (this.id - 1) * GameSizes.realmWidth;
            obj.y = GameSizes.symbolY + i * obj.height;
            
            this.registerRealmObj('obj' + this.id + i, obj)
            this.showRealmObj.push(obj);
        }
    }

    public getMiddleSymbol(): GameObject {
        return this.showRealmObj[1];
    }

    public update(deltaTime: number){
    }

}

