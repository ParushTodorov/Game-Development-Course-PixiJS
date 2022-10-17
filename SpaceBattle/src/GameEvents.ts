export class GameEvents {

    // Game events
    //Player events
    public static PLAYER_SHOOT: string = "PLAYER_SHOOT";
    public static SHIPS_HIT: string = "SHIPS_HIT";
    public static OBJECT_HIT: string = "OBJECT_HIT";
    public static METEOR_HIT: string = "METEOR_HIT";

    //Ammo events
    public static AMMO_HIT: string = "AMMO_HIT";
    public static OUT_OF_STAGE = "AMMO_OUT_OF_STAGE";

    //Bonus events
    public static BONUS_TIME = "BONUS_TIME";
    public static SET_BONUS = "SET_BONUS";

    //Game events
    public static GAME_START: string = "GAME_START";
    public static GAME_LOST: string = "GAME_LOST";

    public static NEXT_LEVEL : string = "NEXT_LEVEL";
}

