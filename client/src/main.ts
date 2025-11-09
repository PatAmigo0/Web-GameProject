import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@services/GameService';
import { GameClient } from './network/GameClient';

export const Game = new GameService(GAME_CONFIG);

const gameClient = new GameClient();
console.log("Звпускаю Гейм Клинт", gameClient);