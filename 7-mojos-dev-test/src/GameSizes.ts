export class GameSizes {

    public static BASIC_SIZE: number = 100;
    
    public static STAGE_WIDTH: number = 6 * this.BASIC_SIZE;
    public static STAGE_HEIGHT: number = 7 * this.BASIC_SIZE;

    //ReelContainer
    public static reelContainerWidth: number = 5 * this.BASIC_SIZE;
    public static reelContainerHeight: number = 3 * this.BASIC_SIZE;
    public static reelContainerX: number = 0.5 * this.BASIC_SIZE;
    public static reelContainerY: number = 2 * this.BASIC_SIZE;

    //Reel
    public static reelWidth: number = 1 * this.BASIC_SIZE;
    public static reelHeight: number = 4 * this.BASIC_SIZE;
    public static reelX: number = 0.5 * this.BASIC_SIZE;
    public static reelY: number = 1 * this.BASIC_SIZE;

   
    //Symbol
    public static symbolWidth: number = 1 * this.BASIC_SIZE;
    public static symbolX: number = GameSizes.reelX;
    public static symbolY: number = GameSizes.reelY;

    //Realm Mask
    public static maskWidth: number = this.reelContainerWidth;
    public static maskHeight: number = this.reelContainerHeight - 14;
    public static maskX: number = this.reelContainerX;
    public static maskY: number = this.reelContainerY + 7;
    
    //Button
    public static buttonWidth: number = 1 * this.BASIC_SIZE;
    public static buttonHeight: number = 1 * this.BASIC_SIZE;
    public static buttonX: number = 4.5 * this.BASIC_SIZE;
    public static buttonY: number = 5.5 * this.BASIC_SIZE;

    //Wallet
    public static walletWidth: number = 2 * this.BASIC_SIZE;
    public static walletHeight: number = 1 * this.BASIC_SIZE;
    public static walletX: number = 0.5 * this.BASIC_SIZE;
    public static walletY: number = 5.5 * this.BASIC_SIZE;

    //Result
    public static resultWidth: number = 5 * this.BASIC_SIZE;
    public static resultHeight: number = 1 * this.BASIC_SIZE;
    public static resultX: number = 0.5 * this.BASIC_SIZE;
    public static resultY: number = 0.5 * this.BASIC_SIZE;

    //Bet Window
    public static bettWidth: number = 1.5 / 7 * GameSizes.STAGE_WIDTH;
    public static betHeight: number = 1 / 14 * GameSizes.STAGE_WIDTH;
    public static betX: number = 6 / 14 * GameSizes.STAGE_WIDTH;
    public static betY: number = 4.5 / 8 * GameSizes.STAGE_WIDTH;

}

