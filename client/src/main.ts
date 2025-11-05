import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@services/GameService';

export const Game = new GameService(GAME_CONFIG);
