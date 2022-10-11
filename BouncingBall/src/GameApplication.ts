import { text } from 'body-parser';
import { OpenCallback } from 'http-proxy';
import * as PIXI from 'pixi.js';
import {Button} from './Button'
import {Button1} from './Button1'
import {Button2} from './Button2'

export class GameApplication extends PIXI.Application {

    public static STAGE_WIDTH: number = 800;
    public static STAGE_HEIGHT: number = 600;

    private static app: GameApplication;
    private mainContainer: PIXI.Container;

    private ball: PIXI.Sprite;
    private velocity: number = 10;
    private btn1Down: boolean = false;
    private btn2Down: boolean = false;
    private x: number = 1;
    private y: number = 1;


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
        this.MyTicker.add(this.onTick, this);
        this.MyTicker.start();

        GameApplication.app = this;
        this.mainContainer = new PIXI.Container();
        this.loader = new PIXI.Loader();
        this.loader.onComplete.add(this.onLoadComplete, this);

        window.onload = () => {
            const gameContainer: HTMLCanvasElement = document.getElementById("gameContainer") as HTMLCanvasElement;
            gameContainer.appendChild(this.view);
            this.stage.addChild(this.mainContainer);

            this.resizeCanvas();
            this.loadAssets();
            this.showText();
            this.createButton();
            this.createContainers();
            this.createBall();

            this.view.style.position = 'absolute';
            this.view.style.left = '50%';
            this.view.style.top = '50%';
            this.view.style.transform = 'translate3d( -50%, -50%, 0 )';
        };
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

    private loadAssets() {

    }

    private showText() {

    }

    private createContainers() {

    }

    private createButton() {
        const btn1: Button1 = new Button1('Start');
        const btn2: Button2 = new Button2('Stop');

        btn1.getDispatcher().addListener('btn1down', this.onBtn1Down, this)
        btn2.getDispatcher().addListener('btn2down', this.onBtn2Down, this)

        btn1.x = 200;
        btn1.y = 450;

        btn2.x = 450;
        btn2.y = 450;

        this.mainContainer.addChild(btn1)
        this.mainContainer.addChild(btn2)
    }

    private onBtn1Down(){
        this.btn1Down = true
    }


    private onBtn2Down(){
        this.btn2Down = true
    }

    private createBall(){
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xff0000);
        gfx.drawCircle(1, 1, 20);
        gfx.endFill();

        const texture: PIXI.Texture = this.renderer.generateTexture(gfx);

        this.ball = new PIXI.Sprite(texture);     
        
        this.mainContainer.addChild(this.ball)
    
    }
      
    private onLoadComplete() {

    }

    private direction(){
        if(0 >= this.ball.x){
            this.ball.x = Math.random();
            this.x = 1;
            return
        }
        
        if(this.ball.x >= this.view.width - this.ball.width) {
            this.ball.x = this.view.width - this.ball.width - Math.random();
            this.x = -1;
            return
        }

        if (0 >= this.ball.y) {
            this.ball.y = Math.random();
            this.y = 1;
            return
        } 
        
        if(this.ball.y >= this.view.height - this.ball.height){
            this.ball.y = this.view.height - this.ball.height - Math.random();
            this.y = -1;
            return
        }
    }

    private onTick(delta: number) {
        
        if (this.btn1Down) {
            if(0 <= this.ball.x && this.ball.x <= this.view.width - this.ball.width &&
                0 <= this.ball.y && this.ball.y <= this.view.height - this.ball.height){
                this.ball.x += this.velocity * delta * this.x;
                this.ball.y += this.velocity * delta * this.y;
                } else {
                    this.direction();
                }
        }

        if (this.btn2Down) {
            this.btn1Down = false
            this.btn2Down = false
        }
    }
}