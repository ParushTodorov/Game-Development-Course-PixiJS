import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { BaseView } from './BaseView';
import { GameObject } from '../game/GameObject';
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from '../GameEvents';
import { BallBehavior } from "../game/behavior/BallBehavior";
import { SquareBehavior } from "../game/behavior/SquareBehavior";
import { AmmunitionBehavior } from "../game/behavior/AmmunitionBehavior";
import { Model } from "../Model";
import { CollisionManager } from "../CollisionManager";
import { GameObjectBehavior } from '../game/behavior/GameObjectBehavior'
import { BonusBaheviorRepository } from "../game/BonusBaheviorRepository";
import { MeteorBehavior } from "../game/behavior/meteors/MeteorBehavior"
import { MeteorFactory } from "../game/level/MeteorFactory"

export class GameView extends BaseView {

    private gameObjects: Map<string, GameObject>;
    private ammoNumber: number = 0;
    private collisionManager: CollisionManager;

    private meteorShower: boolean = true;
    private meteorFactory: MeteorFactory;

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
        this.createCollisionManager();
        this.gameObjects = new Map<string, GameObject>();
        this.hide();
        this.createGameObjects();
        this.createMeteorFactory()
        this.createDispatchers();
    }

    private createCollisionManager() {
        this.collisionManager = new CollisionManager();
    }

    private createGameObjects() {
        this.createPlayerOne();
        this.createPlayerTwo();
    }

    private createMeteorFactory() {
        this.meteorFactory = new MeteorFactory(this)
    }

    private createDispatchers() {
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.OUT_OF_STAGE, this.ammoDestroy, this)
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.SHIPS_HIT, this.shipsHit, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.OBJECT_HIT, this.objectHit, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.AMMO_HIT, this.setHit, this)
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.PLAYER_SHOOT, this.shootingAmo, this)
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BONUS_TIME, this.createBonus, this)
    }
    //EVENTS    
    private shootingAmo(e: any) {
        if (e.player.getId() === 'PlayerOne') {
            if (e.twoTimesToShoot) {
                this.createAmmunition(e.player);
            }
            this.createAmmunition(e.player);
            return;
        };

        if (e.player.getId() === 'PlayerTwo') {
            if (e.twoTimesToShoot) {
                this.createAmmunition(e.player);
            }
            this.createAmmunition(e.player);
            return;
        };
    }

    private ammoDestroy(e: any) {
        if (e.gameObj.getId().includes('Meteor')) {
            this.collisionManager.unregisterObject(e.gameObj.getId())
        };

        this.unregisterGameObject(e.gameObj.getId());
    }

    private shipsHit(e: any) {

        this.getGameObjectById('PlayerOne').x = GameApplication.getApp().view.width * 0.20;
        this.getGameObjectById('PlayerOne').y = GameApplication.getApp().view.height * 0.50;


        this.getGameObjectById('PlayerTwo').x = GameApplication.getApp().view.width * 0.80;
        this.getGameObjectById('PlayerTwo').y = GameApplication.getApp().view.height * 0.50;

        this.meteorShower = true;
        this.gameObjects.forEach((gameObj) => {
            if (!gameObj.getId().includes('Meteor')) {
                return;
            }

            this.meteorShower = false;
            return;
        });

        if (this.meteorShower) {
            this.meteorFactory.startMeteorShower().forEach((meteor, i) => {

                meteor.x = this.createCoordinates()[0];
                meteor.y = 0;

                this.registerGameObject('Meteor' + i, meteor);
                this.collisionManager.registerObject(meteor);
            })
        }
    }

    private objectHit(e: any) {
        if (e.gameObj.getId().includes('Bonus')) {
            const bonusBehavior = e.gameObj.getBonusBehavior().getBehavior(e.ship)
            e.ship.registerBehavior('bonus', bonusBehavior)
        }
        if (e.gameObj.getId().includes('Meteor')) {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.METEOR_HIT, { ship: e.ship })
        }

        this.collisionManager.unregisterObject(e.gameObj.getId())
        this.unregisterGameObject(e.gameObj.getId())
    }

    private setHit(e: any) {
        this.gameObjects.delete(e.ammo.getId())
        e.ammo.destroy()
    }
    //BACKGROUND
    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000);
        this.background.lineStyle({ width: 2, color: 0xffffff });
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.endFill();

        this.addChild(this.background);
        this.createBackgroundStars();
    }

    private createBackgroundStars() {
        for (let i = 0; i < 100; i++) {
            const gfx: PIXI.Graphics = new PIXI.Graphics();
            gfx.beginFill(0xffff00);
            gfx.drawCircle(0, 0, 1);
            gfx.endFill();
            gfx.cacheAsBitmap = true;

            const x = this.createCoordinates()[0];
            const y = this.createCoordinates()[1];
            gfx.position.set(x, y)
            this.background.addChild(gfx)
        }
    }

    private createCoordinates() {
        const x = Math.random() * this.background.width * 0.95 + 10;
        const y = Math.random() * this.background.height * 0.9 + 15;

        return [x, y]
    }
    // OBJECTS
    private createPlayerOne() {
        const playerOne: GameObject = new GameObject(this);
        playerOne.setId('PlayerOne');

        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.lineStyle(2, 0xffffff, 1);
        gfx.beginFill(0xf00ff0);
        gfx.drawRect(0, 0, 40, 40);
        gfx.endFill();
        gfx.position.set(0, 0);

        const sprite: PIXI.Sprite = PIXI.Sprite.from('assets/image/UFO.png')
        sprite.width = 80;
        sprite.height = 80;
        sprite.tint = 0xff0000;

        playerOne.registerRenderable('PlayerOne', sprite);

        playerOne.x = GameApplication.getApp().view.width * 0.10;
        playerOne.y = GameApplication.getApp().view.height * 0.50;

        const ballBehavior: BallBehavior = new BallBehavior(playerOne);
        playerOne.registerBehavior('initialBehavior', ballBehavior);

        this.registerGameObject('PlayerOne', playerOne);
        this.collisionManager.registerPlayerOne(playerOne)
    }

    private createPlayerTwo() {
        const playerTwo: GameObject = new GameObject(this);
        playerTwo.setId('PlayerTwo');

        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.lineStyle(2, 0xffffff, 1);
        gfx.beginFill(0x25ff00);
        gfx.drawRect(0, 0, 40, 40);
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        const sprite: PIXI.Sprite = PIXI.Sprite.from('assets/image/UFO.png')
        sprite.width = 80;
        sprite.height = 80;
        sprite.tint = 0xff0000 * 0.05;

        playerTwo.registerRenderable('PlayerTwo', sprite);

        playerTwo.x = GameApplication.getApp().view.width * 0.80;
        playerTwo.y = GameApplication.getApp().view.height * 0.50;

        const squareBehavior: SquareBehavior = new SquareBehavior(playerTwo);
        squareBehavior.setEnemy(this.gameObjects.get('PlayerOne'))
        this.gameObjects.get('PlayerOne').getBehavior('initialBehavior').setEnemy(playerTwo)

        playerTwo.addBehavior('initialBehavior', squareBehavior);

        this.registerGameObject('PlayerTwo', playerTwo);
        this.collisionManager.registerPlayerTwo(playerTwo);
    }

    private createAmmunition(gameObj: GameObject): void {
        let enemy: GameObject;
        let name: string;
        let x: number;
        let color: number;

        if (gameObj.getId() === 'PlayerOne') {
            enemy = this.gameObjects.get('PlayerTwo');
            name = `AmoOne${this.ammoNumber}`;
            x = gameObj.x + gameObj.width / 2;
            color = 0xff0000
        } else {
            enemy = this.gameObjects.get('PlayerOne');
            name = `AmoTwo${this.ammoNumber}`;
            x = gameObj.x + gameObj.width / 2;
            color = 0x25ff00
        }
        const amoGameObj: GameObject = new GameObject(this);

        const gfx: PIXI.Graphics = new PIXI.Graphics();
        this.background.lineStyle(2, 0xffffff, 1);
        gfx.beginFill(color);
        gfx.drawRoundedRect(0, 0, 8, 4, 1);
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        amoGameObj.x = x;
        amoGameObj.y = gameObj.y + gameObj.height / 2;

        amoGameObj.registerRenderable('amoImg', gfx);
        amoGameObj.setId(name)
        const amonitionBahavior: AmmunitionBehavior = new AmmunitionBehavior(amoGameObj, gameObj, enemy);

        amoGameObj.addBehavior(name, amonitionBahavior);

        this.registerGameObject(name, amoGameObj);

        this.ammoNumber += 1;
    }

    private createBonus(e: any) {
        const bonusGameObj: GameObject = new GameObject(this);
        const name: string = 'Bonus' + e.n;
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.lineStyle(2, 0xffffff, 1);
        gfx.beginFill(0xffffff);
        gfx.drawCircle(0, 0, 10);
        gfx.endFill();

        bonusGameObj.setId('Bonus');
        bonusGameObj.registerRenderable('Bonus', gfx);


        bonusGameObj.x = this.createCoordinates()[0];
        bonusGameObj.y = this.createCoordinates()[1];

        const bonusBahevior: GameObjectBehavior = new BonusBaheviorRepository(bonusGameObj);

        bonusGameObj.addBehavior('bonus', bonusBahevior);

        this.registerGameObject(name, bonusGameObj);
        this.collisionManager.registerObject(bonusGameObj)
    }

    // ACTIONS
    private activateGameObjects() {
        this.gameObjects.forEach((obj, id) => {
            obj.activate();
        });
    }

    private deactivateGameObjects() {
        this.gameObjects.forEach((obj, id) => {
            obj.deactivate();
        });
    }

    private activate() {
        this.activateGameObjects();
        GameApplication.getApp().ticker.add(this.update, this);
    }

    private deactivate() {
        this.deactivateGameObjects();
        GameApplication.getApp().ticker.remove(this.update, this);
    }

    public registerGameObject(id: string, gameObj: GameObject) {
        gameObj.setId(id);
        this.gameObjects.set(id, gameObj);
        this.addChild(gameObj);
    }

    public unregisterGameObject(id: string) {
        const gameObject: GameObject = this.getGameObjectById(id);
        if (!gameObject) {
            console.warn("unregisterGameObject() " + id + " does not exist");
            return;
        }

        this.removeChild(gameObject);
        this.gameObjects.delete(id);
        gameObject.destroy();
    }

    public getGameObjectById(id: string): GameObject | null | undefined {
        if (!this.gameObjects.has(id)) {
            console.warn("getGameObjectById() " + id + " does not exist");
            return null;
        }

        return this.gameObjects.get(id);
    }

    private update(deltaTime: number) {
        this.collisionManager.update()
        this.gameObjects.forEach((gameObj, id) => {
            gameObj.update(deltaTime);
        });
    }
}