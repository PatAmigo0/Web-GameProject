import { HttpStatus } from '@game/shared';
import type { Request, Response } from 'express';

export const ping = async (req: Request, res: Response) => {
	// console.log(`Ping from ${req.ip}`);
	res.sendStatus(HttpStatus.OK);
};
