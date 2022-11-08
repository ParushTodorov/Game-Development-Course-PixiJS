import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { BaseView } from './BaseView';
import { GameObject } from '../game/GameObject';
import { PaddleBehavior } from '../game/behavior/PaddleBehavior';
import { BallBehavior } from '../game/behavior/BallBehavior';
import { LevelFactory } from '../game/level/LevelFactory';
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from '../GameEvents';
import { CollisionManager } from "../CollisionManager";
import { BrickType } from "../game/level/BrickType";
import { GameObjectBehavior } from "../game/behavior/GameObjectBehavior";
import { BonusRepository } from "../game/behavior/BonusRepository";
import { AmmoBehavior } from "../game/behavior/AmmoBehavior";
import { BonusBaseBehavior } from "../game/behavior/BonusBase";
import { BrickBehaviorLevel4 } from "../game/behavior/BrickBehaviors/BrickBehaviorLevel4";
import { Model } from "../Model";

export class GameView extends BaseView {

    private gameObjects: Map<string, GameObject>;
    private levelFactory: LevelFactory;
    private collisionManager: CollisionManager;
    private skyFall: boolean = false;
    private isChangedColors: boolean = false;


    protected init() {
        super.init();
        this.createCollisionManager();
        this.gameObjects = new Map<string, GameObject>();
        this.hide();
        this.createGameObjects();
        this.levelFactory = new LevelFactory(this);
        this.createDispatchers()
    }

    private createCollisionManager() {
        this.collisionManager = new CollisionManager();
    }

    private createDispatchers() {

        EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, this.setnextLevel, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIDE, this.brickHide, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIT, this.brickHit, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.SHOOT, this.ramboMode, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.OBJ_DESTROYED, this.objDestroyed, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.PADDLE_HIT, this.christmasTime, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.SKY_FALL, this.skyFallProtocol, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.CHANGE_COLORS, this.brickHitChangeColors, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.HIDE_BRICKS_COLOR, this.changeColors, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.SHOW_BRICKS_COLOR, this.showBricksColor, this);

    }

    //SHOW, HIDE, ACTIVE
    public show() {
        super.show();

        this.activate();
    }

    public hide() {
        super.hide();

        this.deactivate();
    }

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

    //LEVEL
    private setnextLevel(e: any) {
        this.clearCurrentLevel();
        this.generateLevel(e.level)
    }

    private generateLevel(level: number) {
        this.skyFall = false;
        this.isChangedColors = false;

        this.levelFactory.getNextLevel(level).forEach((e, i, Array) => {
            this.registerGameObject('brick' + i, e);
            this.collisionManager.registerBrickObj(e);
        });
    }

    public clearCurrentLevel() {
        this.collisionManager.clear();
        this.gameObjects.forEach((obj) => {
            if (obj.getId() != 'paddle' && obj.getId() != 'ball') {
                this.unregisterGameObject(obj.getId());
            }
        });
    }

    //GAME OBJ REGISTER
    public getGameObjectById(id: string): GameObject | null | undefined {
        if (!this.gameObjects.has(id)) {
            console.warn("getGameObjectById() " + id + " does not exist");
            return null;
        }

        return this.gameObjects.get(id);
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

    //BACKGROUND
    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000);
        this.background.lineStyle({ width: 2, color: 0xffffff });
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.endFill();

        this.addChild(this.background);

    }

    //GAME OBJECTS
    private createGameObjects() {
        this.createPaddle();
        this.createBall();
    }

    private createPaddle() {
        const paddle: GameObject = new GameObject(this);


        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffffff);
        gfx.drawRoundedRect(0, 0, 80, 8, 10);
        gfx.endFill();


        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);

        const sprite: PIXI.Sprite = PIXI.Sprite.from(texture);
        sprite.width = 80;
        sprite.height = 8;

        sprite.tint = 0x00ff00;

        paddle.registerRenderable('paddleImg', sprite);

        const paddleBehavior: PaddleBehavior = new PaddleBehavior(paddle);

        paddle.registerBehavior('paddleBehavior', paddleBehavior);

        this.collisionManager.registerPaddle(paddle)
        this.registerGameObject('paddle', paddle)

    }

    private createBall() {
        const ball: GameObject = new GameObject(this);
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffffff);
        gfx.drawCircle(0, 0, 10);
        gfx.endFill();

        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        const sprite: PIXI.Sprite = PIXI.Sprite.from(texture);

        sprite.anchor.set(0.5);

        ball.registerRenderable('ballImg', sprite);
        this.collisionManager.registerBall(ball);

        const ballBehavior: BallBehavior = new BallBehavior(ball);

        ball.registerBehavior('ballBehavior', ballBehavior);

        this.registerGameObject('ball', ball)
    }

    //DISPATCHER EVENTS
    private brickHide(e: any) {
        this.collisionManager.unregisteredObject(e.brickId);
        this.unregisterGameObject(e.brickId);

        this.checkForBrick6Only();
    }

    private objDestroyed(e: any) {
        if (e.Id.includes('ammo')) {
            this.collisionManager.unregisteredAmmoObject(e.Id)
        } else {
            this.collisionManager.unregisteredObject(e.Id);
        }

        this.unregisterGameObject(e.Id);
    }

    private brickHit(e: any) {
        if (this.gameObjects.has('bonusRepository')) {
            return;
        }

        let gameObj: GameObject;

        this.gameObjects.forEach((obj) => {
            if (obj.getId() != e.brickId) {
                return;
            }

            gameObj = obj;
        });

        if (e.brickType === BrickType.TYPE_5) {
            this.createBonusObj(gameObj);
        }

        this.checkForBrick6Only();
    }

    private checkForBrick6Only(){
        let isOnlyType6: boolean = true;

        this.gameObjects.forEach((obj) => {
            if (!obj.getId().includes('brick')) {
                return;
            }

            if (CollisionManager.setBrickType(obj) === BrickType.TYPE_6) {
                return;
            }

            isOnlyType6 = false;
        })

        if (isOnlyType6) {
            Model.getInstance().setTotalNbrBrick(0);
        }
    }

    private createBonusObj(gameObj: GameObject) {
        const bonusObj: GameObject = new GameObject(this);

        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffffff);
        gfx.drawEllipse(0, 0, 8, 13);
        gfx.endFill();
        gfx.cacheAsBitmap = true;

        bonusObj.registerRenderable('bonusRepository', gfx);

        bonusObj.x = gameObj.x + gameObj.width / 2;
        bonusObj.y = gameObj.y + gameObj.height;

        const bonusBehaviorRepository: GameObjectBehavior = new BonusRepository(bonusObj);

        bonusObj.registerBehavior('bonusRepository', bonusBehaviorRepository);

        this.collisionManager.registerBrickObj(bonusObj);

        this.registerGameObject('bonusRepository', bonusObj);
    }

    private ramboMode(e: any) {

        for (let i = 0; i < e.timesToShoot; i++) {
            const name: string = 'ammo' + Math.random();
            const ammo: GameObject = new GameObject(this);
            const gfx: PIXI.Graphics = new PIXI.Graphics();
            gfx.beginFill(0xff0012);
            gfx.drawEllipse(0, 0, 2, 4);
            gfx.endFill();
            gfx.cacheAsBitmap = true;

            ammo.registerRenderable('ammo', gfx);

            if (e.timesToShoot === 1) {
                ammo.x = this.gameObjects.get('paddle').x + this.gameObjects.get('paddle').width / 2;
                ammo.y = this.gameObjects.get('paddle').y + this.gameObjects.get('paddle').height / 2;
            } else if (e.timesToShoot === 2) {
                if (i === 0) {
                    ammo.x = this.gameObjects.get('paddle').x;
                    ammo.y = this.gameObjects.get('paddle').y;
                } else {
                    ammo.x = this.gameObjects.get('paddle').x + this.gameObjects.get('paddle').width;
                    ammo.y = this.gameObjects.get('paddle').y + this.gameObjects.get('paddle').height;
                }
            } else if (e.timesToShoot === 3) {
                if (i === 0) {
                    ammo.x = this.gameObjects.get('paddle').x;
                    ammo.y = this.gameObjects.get('paddle').y;
                } else if (i === 1) {
                    ammo.x = this.gameObjects.get('paddle').x + this.gameObjects.get('paddle').width / 2;
                    ammo.y = this.gameObjects.get('paddle').y + this.gameObjects.get('paddle').height / 2;
                } else {
                    ammo.x = this.gameObjects.get('paddle').x + this.gameObjects.get('paddle').width;
                    ammo.y = this.gameObjects.get('paddle').y + this.gameObjects.get('paddle').height;
                }
            }

            const ammoBehavior: AmmoBehavior = new AmmoBehavior(ammo);

            this.collisionManager.registerAmmoObj(ammo);
            ammo.registerBehavior('ammo', ammoBehavior);

            this.registerGameObject(name, ammo);
        }
    }

    private skyFallProtocol(e: any) {
        if (this.skyFall) {
            return;
        };

        this.skyFall = true;
        let time: number = 3000 + 300 * (this.gameObjects.size - 2);

        if (this.gameObjects.get('paddle').getBehaviorById('bonus')) {
            this.gameObjects.get('paddle').unregisterBehavior('bonus')
        };

        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BALL_FREEZE, { time: time });
        console.log(this.gameObjects)

        this.gameObjects.forEach((gameObj) => {
            if (gameObj.getId().includes('paddle') || gameObj.getId().includes('ball')) {
                return;
            }

            if (!gameObj.getId().includes('brick')) {
                this.unregisterGameObject(gameObj.getId())
                return;
            }
            const a = gameObj.getId()
            console.log(a)
            this.bonusText('SkyFallProtocol')
            const renderable: PIXI.Sprite = gameObj.getRenderableById('brickImg') as PIXI.Sprite;
            renderable.tint = 0x0000ff;

            gameObj.unregisterBehavior('brickBehavior');

            const brickBehavior: GameObjectBehavior = new BrickBehaviorLevel4(gameObj);

            gameObj.registerBehavior('brickBehavior', brickBehavior);

            setTimeout(() => {
                if (this.skyFall) {
                    (gameObj.getBehaviorById('brickBehavior') as BrickBehaviorLevel4).activateSkyFallProtocol()
                    //EventDispatcher.getInstance().getDispatcher().emit(GameEvents.SKY_FALL, { brickId: gameObj.getId() })
                }
            }, time);

            if (time > 1000) {
                time -= 300;
            };

        })
    }

    private bonusText(text: string) {
        const bonusText = new PIXI.Text(text, {
            fontSize: 50,
            fill: 0x8c92ac,
        });

        bonusText.anchor.set(0.5);
        bonusText.x = GameApplication.STAGE_WIDTH / 2;
        bonusText.y = GameApplication.STAGE_HEIGHT * 0.4;
        bonusText.rotation -= 0.0025

        this.addChild(bonusText);

        setTimeout(() => {
            this.removeChild(bonusText)
            bonusText.destroy()
        }, 1000);
    }

    private christmasTime(e: any) {
        if (e.objId != 'bonusRepository') {
            return;
        }

        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BONUS_END)

        const bonus: GameObjectBehavior | BonusBaseBehavior = (this.gameObjects.get('bonusRepository').getBehaviorById('bonusRepository') as BonusRepository).getBehavior(this.gameObjects.get('paddle'));
        console.log((bonus as BonusBaseBehavior).name)
        this.bonusText((bonus as BonusBaseBehavior).name)

        this.gameObjects.get('paddle').registerBehavior('bonus', bonus);

        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.BONUS_TIME, { time: (bonus as BonusBaseBehavior).bonusTimer })
    }

    private brickHitChangeColors() {
        this.isChangedColors = true;
        this.changeColors();
    }

    private changeColors() {
        if (!this.isChangedColors) {
            return;
        }

        let colors: Array<number> = [0x00ff00, 0xffff00, 0xff0000, 0x0000ff, 0xff7f00, 0x9400D3, 0x4B0082];

        this.gameObjects.forEach((gameObj) => {
            if (!gameObj.getId().includes('brick')) {
                return;
            }

            const renderable: PIXI.Sprite = gameObj.getRenderableById('brickImg') as PIXI.Sprite;
            renderable.tint = colors[Math.floor(Math.random() * colors.length)];
        })
    }

    private showBricksColor() {
        let colors: Array<number> = [0x00ff00, 0xffff00, 0xff0000, 0x0000ff, 0xff7f00, 0x9400D3, 0x4B0082];

        this.gameObjects.forEach((gameObj) => {
            if (!gameObj.getId().includes('brick')) {
                return;
            }

            const brickType = CollisionManager.setBrickType(gameObj)
            const renderable: PIXI.Sprite = gameObj.getRenderableById('brickImg') as PIXI.Sprite;

            switch (brickType) {
                case BrickType.TYPE_1:
                    {
                        renderable.tint = colors[0];
                    }
                    break;
                case BrickType.TYPE_2:
                    {
                        renderable.tint = colors[1];
                    }
                    break;
                case BrickType.TYPE_3:
                    {
                        renderable.tint = colors[2];
                    }
                    break;
                case BrickType.TYPE_4:
                    {
                        renderable.tint = colors[3];
                    }
                    break;
                case BrickType.TYPE_5:
                    {
                        renderable.tint = colors[4];
                    }
                    break;
                case BrickType.TYPE_6:
                    {
                        renderable.tint = colors[5];
                    }
                    break;
                case BrickType.TYPE_7:
                    {
                        renderable.tint = colors[6];
                    }
                    break;
            }
        })
    }

    //TICKER
    private update(deltaTime: number) {
        this.gameObjects.forEach((obj, id) => {
            obj.update(deltaTime);
        });

        this.collisionManager.update()
        console.log(this.isChangedColors)
    }

}