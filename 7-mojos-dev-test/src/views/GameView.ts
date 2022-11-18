import * as PIXI from 'pixi.js';
import { GameApplication } from "../GameApplication";
import { BaseView } from './BaseView';
import { Symbol } from '../game/Symbol';
import { Reel } from '../game/Reel';
import { GameSizes } from '../GameSizes';
import { ReelContainer } from '../game/ReelContainer';
import { ButtonObject } from '../game/ButtonObject'


export class GameView extends BaseView {

    private reelContainer: ReelContainer;
    private button: ButtonObject;

    //INIT
    protected init() {
        super.init();
        this.createReelContainer();
        this.createStartButton();
        this.hide();
        GameApplication.getApp().ticker.add(this.update, this);
    }

    // OBJECTS
    protected createBackground() {
        this.background = new PIXI.Graphics()
        this.background.lineStyle(3, 0xffffff)
        this.background.beginFill();
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.endFill();
        this.background.cacheAsBitmap = true;

        this.addChild(this.background);

        const texture: PIXI.Texture = PIXI.Texture.from('assets/image/SlotFrame.png');
        
        const sprite: PIXI.Sprite = new PIXI.Sprite(texture);

        sprite.width = GameSizes.reelContainerWidth;
        sprite.height = GameSizes.reelContainerHeight;
        sprite.x = GameSizes.reelContainerX;
        sprite.y = GameSizes.reelContainerY;

        this.addChild(sprite);
    }

    private createReelContainer() {
        this.reelContainer = new ReelContainer(this);
        this.addChild(this.reelContainer)
    }

    private createStartButton() {
        this.button = new ButtonObject(this);
    }

    //GAME
    public startSpin(){
        this.reelContainer.startSpin()
    }

    private update(deltaTime: number) {
        this.reelContainer.update(deltaTime);
        this.button.update(deltaTime)
    }
}