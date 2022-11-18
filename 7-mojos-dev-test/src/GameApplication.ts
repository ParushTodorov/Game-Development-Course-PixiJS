import * as PIXI from 'pixi.js';
import { Game } from './GameController'
import { GameSizes } from './GameSizes';
import { ReelSymbolTypes } from './game/ReelFactory/ReelSymbolTypes'

export class GameApplication extends PIXI.Application {

    private game: Game;

    public static STAGE_WIDTH: number = GameSizes.STAGE_WIDTH;
    public static STAGE_HEIGHT: number = GameSizes.STAGE_HEIGHT;
 
    private static app: GameApplication;
    private mainContainer: PIXI.Container;

    private MyTicker: PIXI.Ticker;

    constructor() {
        super(GameApplication.getAppOptions());
        this.init();
    }

    public static getApp(): GameApplication {
        return this.app;
    }

    private init() {
        this.MyTicker = new PIXI.Ticker();
        this.MyTicker.start();

        GameApplication.app = this;
        this.mainContainer = new PIXI.Container();

        window.onload = async () => {
            const loadTextures = async () => {
                return new Promise<void>((resolve, reject) => {
            
                    this.loader = new PIXI.Loader();
                    this.loader.add('symbol_1', 'assets/image/Symbol_1.png')
                    .add('symbol_2', 'assets/image/Symbol_2.png')
                    .add('symbol_3', 'assets/image/Symbol_3.png')
                    .add('symbol_4', 'assets/image/Symbol_4.png')
                    .add('symbol_5', 'assets/image/Symbol_5.png')
                    .add('symbol_6', 'assets/image/Symbol_6.png')
                    .add('symbol_7', 'assets/image/Symbol_7.png')
                    .add('symbol_8', 'assets/image/Symbol_8.png')
                    .add('SpinButton_Normal', 'assets/image/SpinButton_Normal.png')
                    .add('SpinButton_Active', 'assets/spritesheet/spin-button.json')
                    .add('SpinButton_End', 'assets/image/SpinButton_Active.png')
                    .add('backgroun', 'assets/image/SlotFrame.png')
                    .load(this.onComplete);

                    this.loader.onComplete.add(() => {
                        resolve(); 
                    })

                    this.loader.onError.add(() => {
                        reject();
                    });
                });
            };

            await loadTextures();

            const gameContainer: HTMLCanvasElement = document.getElementById("gameContainer") as HTMLCanvasElement;
            gameContainer.appendChild(this.view);
            this.stage.addChild(this.mainContainer);

            this.resizeCanvas();                
            this.createGame();

            this.view.style.position = 'absolute';
            this.view.style.left = '50%';
            this.view.style.top = '50%';
            this.view.style.transform = 'translate3d( -50%, -50%, 0 )';
        };
    }

    private static getAppOptions() {
        return {
            backgroundColor: 0x000000,
            width: GameApplication.STAGE_WIDTH,
            height: GameApplication.STAGE_HEIGHT,
        }
    }

    private createGame() {
        this.game = new Game();
        this.mainContainer.addChild(this.game);
    }

    private resizeCanvas(): void {
        this.onResize();

        this.onResize = this.onResize.bind(this)

        window.addEventListener('resize', this.onResize);
    }

    private onComplete(loader: any, resources: any){
        ReelSymbolTypes.TYPE_1 = new PIXI.Texture(resources.symbol_1.texture);
        ReelSymbolTypes.TYPE_2 = new PIXI.Texture(resources.symbol_2.texture);
        ReelSymbolTypes.TYPE_3 = new PIXI.Texture(resources.symbol_3.texture);
        ReelSymbolTypes.TYPE_4 = new PIXI.Texture(resources.symbol_4.texture);
        ReelSymbolTypes.TYPE_5 = new PIXI.Texture(resources.symbol_5.texture);
        ReelSymbolTypes.TYPE_6 = new PIXI.Texture(resources.symbol_6.texture);
        ReelSymbolTypes.TYPE_7 = new PIXI.Texture(resources.symbol_7.texture);
        ReelSymbolTypes.TYPE_8 = new PIXI.Texture(resources.symbol_8.texture);
        ReelSymbolTypes.ACTIVE_BUTTON = resources.SpinButton_Active.spritesheet;
        ReelSymbolTypes.NORMAL_BUTTON = new PIXI.Texture(resources.SpinButton_Normal.texture);
        ReelSymbolTypes.END_BUTTON = new PIXI.Texture(resources.SpinButton_End.texture);
    }

    private onResize() {
        this.renderer.resize(GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
    }
}