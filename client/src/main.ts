import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@services/GameService';
import { GameClient } from './network/GameClient';

/**
 * # Главный и единственный экзэмпляр игры. Сам запускает все системы после своего создания
 */
export const Game = new GameService(GAME_CONFIG);

const gameClient = new GameClient();
console.log("Звпускаю Гейм Клинт", gameClient);