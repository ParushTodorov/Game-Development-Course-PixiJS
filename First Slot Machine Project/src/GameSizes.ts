export class GameSizes {
    
    public static STAGE_WIDTH: number = 800;
    public static STAGE_HEIGHT: number = 3 / 4 * GameSizes.STAGE_WIDTH;

    //Realm
    public static realmWidth: number = 1 / 7 * GameSizes.STAGE_WIDTH;
    public static realmHeight: number = 1 / 2 * GameSizes.STAGE_WIDTH;
    public static realmX: number = 2 / 7 * GameSizes.STAGE_WIDTH;
    public static realmY: number = 0;

    //Realm Border
    public static realmBorder: number = 1 / 104  * GameSizes.STAGE_WIDTH;
    
    //Symbol
    public static symbolWidth: number = 1 / 8 * GameSizes.STAGE_WIDTH;
    public static symbolX: number = GameSizes.realmX + GameSizes.realmBorder;
    public static symbolY: number = 0;
    public static symbolNext: number = GameSizes.realmWidth - GameSizes.realmBorder;

    //Realm Mask
    public static maskWidth: number = 1 / 7 * GameSizes.STAGE_WIDTH;
    public static maskHeight: number = 3 / 8 * GameSizes.STAGE_WIDTH;
    public static maskX: number = 2 / 7 * GameSizes.STAGE_WIDTH;
    public static maskY: number = 1 / 8 * GameSizes.STAGE_WIDTH;
    
    //Button
    public static buttonWidth: number = 1 / 7 * GameSizes.STAGE_WIDTH;
    public static buttonHeight: number = 2 / 14 * GameSizes.STAGE_WIDTH;
    public static buttonX: number = 11  / 14  * GameSizes.STAGE_WIDTH;
    public static buttonY: number = 4 / 8 * GameSizes.STAGE_WIDTH;

    //Result
    public static resultWidth: number = 1.7 / 7 * GameSizes.STAGE_WIDTH;
    public static resultHeight: number = 1 / 14 * GameSizes.STAGE_WIDTH;
    public static resultX: number = 1 / 14 * GameSizes.STAGE_WIDTH;
    public static resultY: number = 4.5 / 8 * GameSizes.STAGE_WIDTH;

    //Window
    public static windowWidth: number = GameSizes.symbolWidth + 2 * GameSizes.realmWidth;
    public static windowHeight: number = 1 / 8 * GameSizes.STAGE_WIDTH;
    public static windowX: number =  GameSizes.realmX + GameSizes.realmBorder;
    public static windowY: number = 2 / 8 * GameSizes.STAGE_WIDTH;

    //Bet Window
    public static bettWidth: number = 1.5 / 7 * GameSizes.STAGE_WIDTH;
    public static betHeight: number = 1 / 14 * GameSizes.STAGE_WIDTH;
    public static betX: number = 6 / 14 * GameSizes.STAGE_WIDTH;
    public static betY: number = 4.5 / 8 * GameSizes.STAGE_WIDTH;

}

