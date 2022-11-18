import * as PIXI from 'pixi.js';
import { GameView } from '../views/GameView';
import { Reel } from './Reel';
import { ReelSymbolTypes } from './ReelFactory/ReelSymbolTypes';
import { GameSizes } from '../GameSizes';
import { EventDispatcher } from '../EventDispatcher';
import { GameEvents } from '../GameEvents';
import { Model } from '../Model';
import { Game } from '../GameController';
import { GameApplication } from '../GameApplication';

export class ButtonObject extends PIXI.Container {

    protected gameViewRef: GameView;

    private button: PIXI.Sprite | PIXI.AnimatedSprite;

    protected renderer: Map<string, PIXI.DisplayObject>;

    private echoButton: PIXI.Graphics;
    private isClicked: boolean = false;
    private deltaEchoButton: number = 0;

    constructor(gameViewRef: GameView) {
        super();
        this.gameViewRef = gameViewRef;
        this.init();
    }

    protected init() {
        this.createNormalButton();
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.STOP_SPIN, this.stopSpin, this);
    }

    private createNormalButton() {
        this.button = new PIXI.Sprite(ReelSymbolTypes.NORMAL_BUTTON);

        this.setButonParam();

        this.button.interactive = true;

        this.button.on("pointerdown", this.onClick, this);
        this.button.on("mouseover", this.onMouseOver, this);
        this.button.on("mouseout", this.onMouseOut, this);
        
        this.gameViewRef.addChild(this.button);
    }

    private onMouseOver() {
        this.createEchoButton();
    }

    private createEchoButton() {
        this.echoButton = new PIXI.Graphics();
        this.echoButton.lineStyle(4, 0xffffff, 0.3);
        this.echoButton.beginFill(0x000000, 0);
        this.echoButton.drawCircle(0, 0, GameSizes.buttonWidth / 2.15);
        this.echoButton.endFill();
        this.echoButton.cacheAsBitmap = true;

        this.echoButton.x = GameSizes.buttonX + GameSizes.buttonWidth / 2;
        this.echoButton.y = GameSizes.buttonY + GameSizes.buttonHeight / 2;

        this.gameViewRef.addChild(this.echoButton);
    }

    private onMouseOut() {
        this.gameViewRef.removeChild(this.echoButton);
        this.echoButton = null;
    }

    private createActiveButton() {
        this.button = new PIXI.AnimatedSprite(ReelSymbolTypes.ACTIVE_BUTTON.animations.SpinButton_Active);
        
        this.setButonParam();
        (this.button as PIXI.AnimatedSprite).animationSpeed = 0.3;
        (this.button as PIXI.AnimatedSprite).play();
        
        this.gameViewRef.addChild(this.button);
    }

    private createEndButton() {
        this.button = new PIXI.Sprite(ReelSymbolTypes.END_BUTTON);

        this.setButonParam();

        this.gameViewRef.addChild(this.button);
    }

    private setButonParam() {
        this.button.width = GameSizes.buttonWidth;
        this.button.height = GameSizes.buttonHeight;

        this.button.x = GameSizes.buttonX;
        this.button.y = GameSizes.buttonY;
    }

    private onClick() {
        this.isClicked = true;

        setTimeout(() => {
            this.isClicked = false;
        }, 300)

        EventDispatcher.getInstance().getDispatcher().emit(GameEvents.START_SPIN);
        this.gameViewRef.removeChild(this.button);
        this.createActiveButton();
    }

    private stopSpin() {
        this.gameViewRef.removeChild(this.button);

        if (Model.getInstance().getAmount() === 0 || Model.getInstance().getAmount() < Game.BET) {
            this.createEndButton();
            return;
        }

        this.createNormalButton();
    }

    public update(deltaTime: number) {
        if (!this.isClicked) {
            this.deltaEchoButton = 0;
        }

        if (this.isClicked && this.echoButton) {
            this.deltaEchoButton += 0.05;
            if (this.echoButton.alpha - this.deltaEchoButton > 0) {
                this.echoButton.alpha = 1 - this.deltaEchoButton;
            } else {
                this.echoButton.alpha = 0;
            }
            
            this.echoButton.scale.set(1 + this.deltaEchoButton);
        }
    }

}