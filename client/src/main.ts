import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@services/GameService';

/**
 * # Главный и единственный экзэмпляр игры. Сам запускает все системы после своего создания
 */
export const Game = new GameService(GAME_CONFIG);

//#region тест запроса
const response = await fetch('http://localhost:2567/api/auth/test', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ lol: 'АХХ' }),
});

console.log('ОТПРАВИЛ ИНФУ НА СЕРВАК И ПОЛУЧИЛ', response);
console.log('ДАННЫЕ ОТ СЕРВЕРА: ', await response.json());
//#endregion
