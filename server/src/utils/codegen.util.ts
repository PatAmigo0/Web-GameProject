import { CODE_LENGTH } from '@config/generation.config';

const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateRoomCode = () => {
	let result = '';
	for (let i = 0; i < CODE_LENGTH; i++) {
		result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
	}
	return result;
};
