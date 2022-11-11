import { EventDispatcher } from "./EventDispatcher";
import { RealmObjTypes } from './game/RealmFactory/RealmObjTypes';
import { GameEvents } from "./GameEvents";

interface gamePlayedByType {
    ['TYPE_1']: number,
    ['TYPE_2']: number,
    ['TYPE_3']: number,
    ['TYPE_4']: number,
    ['TYPE_5']: number,
    ['TYPE_6']: number,
    ['TYPE_7']: number,
    ['TYPE_8']: number,

};

export interface ModelInfo {
    'gamePlayed': number,
    'incomeSize': number,
    'prizes': number,
    'winningGamesPlayed': number,
    'gamesPlayedByType': gamePlayedByType,
};

export class Model {

    private static instance: Model;

    private gamePlayed: number = 0;
    private incomeSize: number = 0;

    private prizes: number = 0;
    private winningGamesPlayed: number = 0;
    private gamesPlayedByType: gamePlayedByType;
    private winningSymbol: RealmObjTypes;

    private amount: number;

    constructor() {
        this.init();
    }

    private init() {
        this.setGamesPlayedByTypeInitial();
    }

    private setGamesPlayedByTypeInitial(){
        this.gamesPlayedByType = {
            ['TYPE_1']: 0,
            ['TYPE_2']: 0,
            ['TYPE_3']: 0,
            ['TYPE_4']: 0,
            ['TYPE_5']: 0,
            ['TYPE_6']: 0,
            ['TYPE_7']: 0,
            ['TYPE_8']: 0,
        }
    }

    public setAmount(amount: number) {
        this.amount = amount;
    }

    public getAmount() {
        return this.amount;
    }

    public static getInstance(): Model {
        if (!this.instance) {
            this.instance = new Model()
        }

        return this.instance;
    }

    public resetGame() {
        this.gamePlayed = 0;
        this.incomeSize = 0;
        this.prizes = 0;
        this.winningGamesPlayed = 0;
        this.setGamesPlayedByTypeInitial();
    }

    public setGame(bet: number) {
        this.gamePlayed++;
        this.incomeSize += bet;
        this.amount -= bet;
    }

    public getStartGameInfo(): ModelInfo {
        const modelInfo: ModelInfo = {
            'gamePlayed': this.gamePlayed,
            'incomeSize': this.incomeSize,
            'prizes': this.prizes,
            'winningGamesPlayed': this.winningGamesPlayed,
            'gamesPlayedByType': this.gamesPlayedByType,
        }

        return modelInfo;
    }

    public setWinnersGame(type: RealmObjTypes){
        this.winningSymbol = type;
        this.winningGamesPlayed ++;
        this.prizes += RealmObjTypes.PRIZES(type)
        this.incrGamesType(type);
        
    }

    public getWinnigSymbol(): RealmObjTypes | null{
        if (!this.winningSymbol){
            return null;
        }

        return this.winningSymbol;
    }

    private incrGamesType(type: RealmObjTypes){
        switch(type) {
            case "TYPE_1":
                {
                    this.gamesPlayedByType['TYPE_1']++;
                }
                break;
            case "TYPE_2":
                {
                    this.gamesPlayedByType['TYPE_2']++;
                }
                break;
            case "TYPE_3":
                {
                    this.gamesPlayedByType['TYPE_3']++;
                }
                break;
            case "TYPE_4":
                {
                    this.gamesPlayedByType['TYPE_4']++;
                }
                break;
            case "TYPE_5":
                {
                    this.gamesPlayedByType['TYPE_5']++;
                }
                break;
            case "TYPE_6":
                {
                    this.gamesPlayedByType['TYPE_6']++;
                }
                break;
            case "TYPE_7":
                {
                    this.gamesPlayedByType['TYPE_7']++;
                }
                break;
            case "TYPE_8":
                {
                    this.gamesPlayedByType['TYPE_8']++;
                }
                break;
        }
    }


}