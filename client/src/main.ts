import { DEV_LOCAL_URL, HTTPS_URL } from '@config/core.config';
import { GAME_CONFIG } from '@config/game.config';
import { GameService } from '@services/GameService';

/**
 * # Главный и единственный экзэмпляр игры. Сам запускает все системы после своего создания
 */
export const Game = new GameService(GAME_CONFIG);

//#region тест запроса
const response = await fetch(__PRODUCTION__ ? `${HTTPS_URL}/api/auth/test` : DEV_LOCAL_URL, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ lol: 'АХХ' }),
});

console.log('ОТПРАВИЛ ИНФУ НА СЕРВАК И ПОЛУЧИЛ', response);
console.log('ДАННЫЕ ОТ СЕРВЕРА: ', await response.json());
//#endregion
