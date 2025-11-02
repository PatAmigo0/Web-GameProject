import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@services/GameService';
import '@styles/style.css';

export const Game = new GameService(GAME_CONFIG);
