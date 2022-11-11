import * as PIXI from 'pixi.js';
import { GameApplication } from "../GameApplication";
import { BaseView } from './BaseView';
import { GameObject } from '../game/GameObject';
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from '../GameEvents';
import { Game } from "../GameController";
import { Realm } from '../game/Realm';
import { RealmObjFactory } from '../game/RealmFactory/RealmObjFactory';
import { GameSizes } from '../GameSizes';
import { ButtonBehavior } from '../game/behavior/ButtonBehavior'


export class GameView extends BaseView {

    private realms: Map<string, Realm>;
    private gameObjects: Map<string, GameObject>;
    private realmObjFactory: RealmObjFactory;
    private registerCount: number = 0;
    private winnerGame: boolean = false;
    private showWindow: PIXI.Graphics;


    //START
    public show() {
        super.show();

        this.activate();
    }

    public hide() {
        super.hide();
        this.deactivate();
    }
    //INIT
    protected init() {
        super.init();
        this.realmObjFactory = new RealmObjFactory(this)
        this.realms = new Map<string, Realm>();
        this.gameObjects = new Map<string, GameObject>();
        this.createRealms();
        this.createStartButton();
        this.createBorder();
        this.createShowWindow(); 
        this.hide();
        this.createDispatchers();
        GameApplication.getApp().ticker.add(this.update, this);
    }

    private createDispatchers() {
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.START_SPIN, this.startSpin, this)
    }

    //BACKGROUND
    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.lineStyle(5, 0xffffff, 1)
        this.background.beginFill(0x253769, 0);
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.beginFill();
        this.background.cacheAsBitmap = true;

        const sprite: PIXI.Sprite = new PIXI.Sprite(GameApplication.BACKGROUND);
        sprite.alpha = 0.8;

        this.addChild(sprite);
        this.addChild(this.background)

    }

    // OBJECTS
    private createRealms() {
        this.realmObjFactory.setGame(this.winnerGame);

        for (let i = 0; i < 3; i++) {

            const realm: Realm = new Realm(this, i);
            this.registerRealm(i + 1, realm);
            realm.setId(i + 1);
            realm.setRealmObjects(this.realmObjFactory.getRealm(i + 1));
        }
    }

    private createStartButton() {
        const button: GameObject = new GameObject(this);

        const gfx: PIXI.Graphics = new PIXI.Graphics;
        gfx.lineStyle(2, 0x253769, 1)
        gfx.beginFill(0xffffff)
        gfx.drawRoundedRect(0, 0, GameSizes.buttonWidth, GameSizes.buttonHeight, 10)
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        button.registerRenderable('buttonImg', gfx);

        button.x = GameSizes.buttonX;
        button.y = GameSizes.buttonY;

        const buttonBehavior: ButtonBehavior = new ButtonBehavior(button);

        this.registerGameObj('button', button);

        const text = new PIXI.Text('SPIN', {
            fontFamily: 'Papyrus',
            fontSize: 20,
            fontWeight: 'bold',
            fill: 0x253769, 
            padding: 10,
            dropShadow: true, 
            dropShadowAlpha: 0.15,  
        })

        text.anchor.set(0.5);
        text.x = button.x + button.width / 2;
        text.y = button.y + button.height / 2;

        this.addChild(text);
    }

    private createBorder() {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.lineStyle(3, 0x253769, 1);
        gfx.beginFill(0x000000, 0);
        gfx.drawRoundedRect(0, 0, GameSizes.symbolWidth + 2 * GameSizes.realmWidth , GameSizes.maskHeight, 10);
        gfx.endFill();

        gfx.cacheAsBitmap = true;

        gfx.x = GameSizes.symbolX;
        gfx.y = GameSizes.maskY;

        this.addChild(gfx);
    }

    private createShowWindow() {
        this.showWindow = new PIXI.Graphics();
        this.showWindow.lineStyle(3, 0x253769, 1)
        this.showWindow.beginFill(0x253769, 0);
        this.showWindow.drawRoundedRect(0, 0, GameSizes.windowWidth, GameSizes.windowHeight, 3);
        this.showWindow.endFill();

        this.showWindow.cacheAsBitmap = true;

        this.showWindow.x = GameSizes.windowX;
        this.showWindow.y = GameSizes.windowY;

        this.addChild(this.showWindow);
        
        this.showWindow.alpha = 0;
        
    }

    // ACTIONS
    private activateRealms() {
        this.realms.forEach((obj, id) => {
            obj.activate();
        });
    }

    private deactivateRealms() {
        this.realms.forEach((obj, id) => {
            obj.deactivate();
        });
    }

    private activate() {
        this.activateRealms();
        GameApplication.getApp().ticker.add(this.update, this);
    }

    private deactivate() {
        this.deactivateRealms();
        GameApplication.getApp().ticker.remove(this.update, this);
    }

    public registerRealm(id: number, gameObj: Realm) {
        gameObj.setId(id);
        this.realms.set('realm' + id, gameObj);
        this.addChild(gameObj);
    }

    public registerGameObj(id: string, gameObj: GameObject) {
        this.registerCount++;
        gameObj.setId(id);
        this.gameObjects.set(id, gameObj);

        if(id === 'button'){
            this.addChild(gameObj);
        }
    }

    public unregisterObj(id: string) {
        const gameObject: Realm | GameObject= this.getObjById(id);
        if (!gameObject) {
            console.warn("unregisterGameObject() " + id + " does not exist");
            return;
        }
       
        this.realms.delete(id);
    }

    public getObjById(id: string): GameObject | null | undefined {
        if (!this.gameObjects.has(id)) {
            console.warn("getGameObjectById() " + id + " does not exist");
            return null;
        }

        return this.gameObjects.get(id);
    }

    public getRealmById(id: string): Realm | null | undefined {
        if (!this.realms.has(id)) {
            console.warn("getGameObjectById() " + id + " does not exist");
            return null;
        }

        return this.realms.get(id);
    }
    //GAME
    public setGame(result: boolean){
        this.winnerGame = result;
    }

    private startSpin(){
        this.showWindow.alpha = 0;
        this.recreateRealms();
        this.registerCount = 0;
        this.gameObjects.forEach(obj => {
            obj.startMove()
        });
    }

    private recreateRealms(){
        this.realmObjFactory.setGame(this.winnerGame);

        for (let i = 0; i < 3; i++) {
            const realm: Realm = this.getRealmById('realm' + (i + 1));         
            realm.setRealmObjects(this.realmObjFactory.getRealm(i + 1));   
        }
    }

    private update(deltaTime: number) {
        if(this.registerCount > (Game.SYMBOLS_NUMBER + 1) * 3){
            this.showWindow.alpha = 1;
            this.realms.forEach((realm, id) => {
                realm.setStatic();
             });

            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.STOP_SPIN)
        } 

        this.realms.forEach((realm, id) => {
           realm.update(deltaTime);
        });

        this.gameObjects.forEach((gameObj) => {
            gameObj.update(deltaTime)
        })
    }
}