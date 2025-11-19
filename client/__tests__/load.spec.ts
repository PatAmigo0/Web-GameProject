// import test, { expect } from '@playwright/test';

// test('rateLimit: /api/probing/ping check 429', async ({ request }) => {
// 	const maxRequests = 200;
// 	let limitReached = false;

// 	console.log(`Начинаем бомбардировку /api/probing/ping (${maxRequests} попыток)...`);

// 	for (let i = 0; i < maxRequests; i++) {
// 		const response = await request.get('/api/probing/ping');

// 		if (response.status() === 429) {
// 			console.log(`Успех! Лимит срабатал на запросе №${i + 1}. Статус: 429`);
// 			limitReached = true;
// 			break;
// 		}
// 	}

// 	expect(limitReached, 'Сервер не вернул 429 (Too Many Requests) после 200 запросов').toBeTruthy();
// });
