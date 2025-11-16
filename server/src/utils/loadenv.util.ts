import dotenv from 'dotenv';

export const loadenv = () => {
	const nodeEnv = process.env.NODE_ENV || 'development';
	const envFilePath = `.env.${nodeEnv}`;
	dotenv.config({ path: envFilePath });
};
