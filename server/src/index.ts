import { listen } from '@colyseus/tools';
import app from './app.config';

console.log('Starting Colyseus server...');
listen(app, 52);
