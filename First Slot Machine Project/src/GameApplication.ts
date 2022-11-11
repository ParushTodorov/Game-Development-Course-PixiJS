import * as PIXI from 'pixi.js';
import { resources } from 'pixi.js';
import { Game } from './GameController'
import { GameSizes } from './GameSizes';

export class GameApplication extends PIXI.Application {

    private game: Game;

    public static STAGE_WIDTH: number = GameSizes.STAGE_WIDTH;
    public static STAGE_HEIGHT: number = GameSizes.STAGE_HEIGHT;
    public static BACKGROUND: PIXI.Texture;
 
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
        this.loader = new PIXI.Loader();
        
        GameApplication.BACKGROUND = PIXI.Texture.from('assets/image/background.jpg')

        window.onload = () => {
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

    private createGame() {
        this.game = new Game();
        this.mainContainer.addChild(this.game)
    }

    private static getAppOptions() {
        return {
            backgroundColor: 0x989c99,
            width: GameApplication.STAGE_WIDTH,
            height: GameApplication.STAGE_HEIGHT,
        }
    }

    private resizeCanvas(): void {
        this.onResize();

        this.onResize = this.onResize.bind(this)

        window.addEventListener('resize', this.onResize);
    }

    private onResize() {
        this.renderer.resize(GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
    }
}