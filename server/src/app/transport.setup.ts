import { WebSocketTransport } from '@colyseus/ws-transport';

export const initializeTransport = (options: any) => {
	return new WebSocketTransport(options);
};
