import { SERVER_URL } from '@config/core.config';
import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@services/GameService';
import { Client } from 'colyseus.js';

/**
 * # Главный и единственный экзэмпляр игры. Сам запускает все системы после своего создания
 */
export const Game = new GameService(GAME_CONFIG);

console.log(import.meta.env.VITE_SERVER_URL);
console.log(SERVER_URL);
const test = new Client(`ws://${SERVER_URL}`);
console.log(test);
console.log('AAA');
test.create('baseGameRoom', {
	name: 'idk',
});
