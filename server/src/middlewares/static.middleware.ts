import { playground } from '@colyseus/playground';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');

export const staticMiddleware =
	process.env.NODE_ENV === 'production' ? express.static(clientBuildPath) : playground();
