import * as PIXI from 'pixi.js';
import { EventDispatcher } from './EventDispatcher';
import { WalletView } from './views/WalletView';
import { Model } from './Model';
import { GameView } from './views/GameView';
import { GameEvents } from './GameEvents';
import { ReelObjTypes } from './game/ReelFactory/ReelObjTypes';
import { Symbol } from './game/Symbol';
import { MessageControllerView } from './views/MessageControllerView';

export class Game extends PIXI.Container {

    private gameView: GameView;
    private walletView: WalletView;
    private messageControllerView: MessageControllerView;

    private gameIsStarted: boolean = false;

    private winningType: Array<[number, ReelObjTypes]>;

    public static BET: number = 0.25;
    public static LEN_OF_SYMBOLS_ARRAY: number = 100;
    public static AMOUNT: number = 10;
    public static REEL_VELOCITY: number = 60;
    public static OBJECT_ROTATED: number = 150;

    constructor() {
        super();
        this.init()
    }

    private init() {
        this.createViews();
        Model.getInstance().setAmount(Game.AMOUNT);
        this.createDispatchers();

    }

    private createDispatchers(){
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.START_SPIN, this.startSpin, this);
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.STOP_SPIN, this.spinEnd, this);
    }
    
    private createViews() {
        this.gameView = new GameView();
        this.addChild(this.gameView);
        this.showGame()

        this.walletView = new WalletView();
        this.walletView.setAmount(Game.AMOUNT);
        this.addChild(this.walletView);

        this.messageControllerView = new MessageControllerView();
        this.addChild(this.messageControllerView);
        this.hideMessageControllerViewView()
    }

    public showGame() {
        this.gameView.show();
    }

    public showMessageControllerViewView() {
        this.messageControllerView.show();
    }

    public hideMessageControllerViewView() {
        this.messageControllerView.hide();
    }

    private startSpin(){
        if (this.gameIsStarted){
            return;
        }

        this.gameIsStarted = true;
        this.winningType = [];

        Model.getInstance().setGame(Game.BET);
        const amount: number = Model.getInstance().getAmount()
        this.walletView.setAmount(amount)

        this.gameView.startSpin()
    }

    private spinEnd(e: any){
        if (!this.gameIsStarted) {
            return;
        }

        let amount: number = Model.getInstance().getAmount();
        let prize: number = 0;

        this.calculatePrize(e.array);
    

        this.winningType.forEach(([count, winningType]) => {

            if(!winningType) {
                return;
            }

            prize += ReelObjTypes.PRIZES(winningType) * count
        })

        if(prize){
            this.messageControllerView.setWinning(prize);
            this.showMessageControllerViewView();
            setTimeout(() => {
                this.hideMessageControllerViewView();
            }, 4000)

            amount += prize;
        }

        if (amount === 0 || amount < Game.BET) {
            this.messageControllerView.setEndMessage();
            this.showMessageControllerViewView();
            return;
        }

        Model.getInstance().setAmount(amount);
        this.walletView.setAmount(amount);
        this.gameIsStarted = false;
    }
    
    // If there are three or more equal symbols from first position
    private calculatePrize(arr: Array<Array<Symbol>>) {

        let counts: number;

        matixLoop: for (let j = 0; j < 3; j++) {
            counts = 1;
            let winningType = null;

            for (let i = 0; i < arr.length - 1; i++){
                
                if (counts === 5){
                    continue matixLoop;
                }

                if (arr[i][j].getBehavior('reelObjBehavior').type != arr[i + 1][j].getBehavior('reelObjBehavior').type) {
                    if (counts < 3) {
                        winningType = null;
                    }

                    this.winningType.push([counts, winningType]);
                    continue matixLoop;
                }            
                
                counts++;
                winningType = arr[i][j].getBehavior('reelObjBehavior').type;
            }

            if (counts < 3) {
                winningType = null;
            }

            this.winningType.push([counts, winningType])   
        }
    }

    // If there are three or more equal symbols in any position in middle row
    /*private setMultiplier(arr: Array<GameObject>): number {
        let counts: number = 1;

        for (let i=0; i<arr.length - 1; i++){
            
            if (counts === 5){
                break;
            }

            if (arr[i].getBehavior('reelObjBehavior').type === arr[i + 1].getBehavior('reelObjBehavior').type) {
                counts++;
                this.winningType = arr[i].getBehavior('reelObjBehavior').type
                continue;
            }            
            
            if (i >= 2) {
                break;
            }

            counts = 1;
        }

        if (counts < 3) {
            this.winningType = null;
            return 3
        }

        return counts
    }*/
}