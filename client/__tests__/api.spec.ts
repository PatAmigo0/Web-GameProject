// tests/api.spec.ts
import { expect, test } from '@playwright/test';

test('testRoomCreation: /api/protected/rooms/create', async ({ request }) => {
	const response = await request.post('/api/protected/rooms/create', {
		headers: {
			'Content-Type': 'application/json',
		},
		data: {
			f: 'trax trax',
		},
	});

	console.log(response.status(), response.ok());
	const data = await response.json();
	console.log('Данные от /api/protected/rooms/create:', data);

	expect(response.ok()).toBeFalsy();
});

test('registration: /api/auth/registration', async ({ request }) => {
	const response = await request.post('/api/auth/registration', {
		headers: {
			'Content-Type': 'application/json',
		},

		data: {
			login: 'tohue',
			password: '312000',
		},
	});

	const data = await response.json();
	console.log('Данные от /api/auth/registration', data);

	expect(response.ok()).toBeFalsy();
});

test('login: /api/auth/login', async ({ request }) => {
	const response = await request.post('/api/auth/login', {
		headers: {
			'Content-Type': 'application/json',
		},

		data: {
			login: 'tohue',
			password: '312000',
		},
	});

	const data = await response.json();
	console.log('Данные от /api/auth/login', data);

	expect(response.ok()).toBeTruthy();
});
