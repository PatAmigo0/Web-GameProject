// tests/api.spec.ts
import { expect, test } from '@playwright/test';

test('testSignal: /api/auth/test', async ({ request }) => {
	const response = await request.post('/api/auth/test', {
		headers: {
			'Content-Type': 'application/json',
		},
		data: {
			lol: 'АХХ',
		},
	});

	expect(response.ok()).toBeTruthy();

	const data = await response.json();
	console.log('Данные от /api/auth/test:', data);
});

test('testRoomCreation: /api/rooms/create', async ({ request }) => {
	const response = await request.post('/api/rooms/create', {
		headers: {
			'Content-Type': 'application/json',
		},
		data: {
			f: 'trax trax',
		},
	});

	expect(response.ok()).toBeTruthy();

	const data = await response.json();
	console.log('Данные от /api/rooms/create:', data);
});
