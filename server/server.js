// server/server.js
import { PeerServer } from 'peer';

const port = 9000;
const path = '/webgame';

const peerServer = PeerServer({
	port: port,
	path: path,
	allow_discovery: true,
	proxied: process.env.NODE_ENV === 'production',
});

peerServer.on('connection', (client) => {
	console.log(`Client connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
	console.log(`Client disconnected: ${client.getId()}`);
});

peerServer.on('error', (error) => {
	console.error('PeerServer error:', error);
});

console.log(`PeerJS server running on port ${port}`);
console.log(`PeerJS server path: ${path}`);
