import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@game';
import '@styles/style.css';

const _game = new GameService(GAME_CONFIG);
export const Game = _game;
