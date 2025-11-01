import { GAME_CONFIG } from './config/game.config';
import { GameService } from './Game';
import '../styles/style.css';

const _game = new GameService(GAME_CONFIG);
export const Game = _game;
