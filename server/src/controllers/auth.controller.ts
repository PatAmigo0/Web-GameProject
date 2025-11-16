import type { Request, Response } from 'express';

export const test = async (req: Request, res: Response) => {
	console.log('Тело запроса:', req.body);

	res.status(200).json({
		message: 'Тест пройден',
		receivedData: req.body,
		ah: 'lol',
	});
};
