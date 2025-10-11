// src/network/NetworkManager.ts

import Peer, { type DataConnection } from 'peerjs';
import GameScene from '../scenes/test_scene';
import type { GameData } from '../types/types';

class NetworkManager {
	private scene: GameScene;
	public peer: Peer | null = null;
	public id: string | null = null;
	private connections: Map<string, DataConnection> = new Map();

	constructor(scene: GameScene) {
		this.scene = scene;
	}

	public startPeer(): Promise<void> {
		return new Promise((resolve) => {
			this.peer = new Peer('', {
				host: 'localhost',
				port: 9000,
				path: '/webgame',
			});

			this.peer.on('open', (id) => {
				this.id = id;
				console.log('My Peer ID is:', id);
				this.scene.showMyId(id);
				resolve();
			});

			this.peer.on('connection', (conn) => {
				console.log(`Incoming connection from ${conn.peer}`);
				this.setupConnection(conn);
			});
		});
	}

	public connectToPeer(peerId: string): void {
		if (!this.peer) {
			console.error('PeerJS not initialized yet!');
			return;
		}
		const conn = this.peer.connect(peerId);
		this.setupConnection(conn);
	}

	private setupConnection(conn: DataConnection): void {
		conn.on('open', () => {
			console.log(`Connection with ${conn.peer} is open.`);
			this.connections.set(conn.peer, conn);
			this.scene.onPlayerConnected(conn.peer);
		});

		conn.on('data', (data: unknown) => {
			this.scene.handleNetworkData(conn.peer, data as GameData);
		});

		conn.on('close', () => {
			console.log(`Connection with ${conn.peer} has closed.`);
			this.connections.delete(conn.peer);
			this.scene.onPlayerDisconnected(conn.peer);
		});

		conn.on('error', (err) => {
			console.error(`Connection error with ${conn.peer}:`, err);
		});
	}

	public broadcast(data: GameData): void {
		for (const conn of this.connections.values()) conn.send(data);
	}
}

export default NetworkManager;
