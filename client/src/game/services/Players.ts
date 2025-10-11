import { Player } from "../classes/player/Player";

export class Players 
{ 
    private players: Player[] = [];

    public getPlayerByID(playerID: string) : Player | undefined 
    {
        return this.players.find(plr => plr.playerID == playerID);
    }
}