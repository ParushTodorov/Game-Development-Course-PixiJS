import { Game } from "../../GameController";

export class RealmObjTypes {

    public static TYPE_1: string = "TYPE_1";
    public static TYPE_2: string = "TYPE_2";
    public static TYPE_3: string = "TYPE_3";
    public static TYPE_4: string = "TYPE_4";
    public static TYPE_5: string = "TYPE_5";
    public static TYPE_6: string = "TYPE_6";
    public static TYPE_7: string = "TYPE_7";
    public static TYPE_8: string = "TYPE_8";

    public static PRIZES(type: RealmObjTypes) {
        let prize: number = 0;
        switch(type) {
            case "TYPE_1":
                {
                    prize = 1 * Game.BET;
                }
                break;
            case "TYPE_2":
                {
                    prize = 2 * Game.BET;
                }
                break;
            case "TYPE_3":
                {
                    prize = 5 * Game.BET;
                }
                break;
            case "TYPE_4":
                {
                    prize = 10 * Game.BET;
                }
                break;
            case "TYPE_5":
                {
                    prize = 20 * Game.BET;
                }
                break;
            case "TYPE_6":
                {
                    prize = 50 * Game.BET;
                }
                break;
            case "TYPE_7":
                {
                    prize = 100 * Game.BET;
                }
                break;
            case "TYPE_8":
                {
                    prize = 1000 * Game.BET;
                }
                break;
        }
        
        return prize;
    }
}