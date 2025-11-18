import type { Request, Response } from 'express';

export const ping = async (req: Request, res: Response) => {
	console.log(`Ping from ${req.ip}`);
	res.status(200).json('Pong!');
};
