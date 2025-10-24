// src/network/NetworkService.ts

import Peer, { type DataConnection } from 'peerjs';
import type { GameData } from '../types/game.types';
import Phaser from 'phaser';

export class NetworkService extends Phaser.Events.EventEmitter {
	public peer: Peer | null = null;
	public id: string | null = null; // ID нашего пира
	public hostId: string | null = null; // ID хоста
	private connections: Map<string, DataConnection> = new Map();

	constructor() {
		super();
	}

	public startPeer(isHost: boolean, hostId?: string): Promise<string> {
		return new Promise((resolve) => {
			this.peer = new Peer('', {
				host: 'localhost',
				port: 9000,
				path: '/webgame',
			});

			this.peer.on('open', (id) => {
				this.id = id;
				console.log('My Peer ID is:', id);
				if (isHost) {
					this.hostId = id;
				}
				resolve(id);
			});

			this.peer.on('connection', (conn) => {
				console.log(`Incoming connection from ${conn.peer}`);
				this.setupConnection(conn);
			});

			if (!isHost && hostId) {
				this.connectToPeer(hostId);
			}
		});
	}

	public connectToPeer(peerId: string): void {
		if (!this.peer || !this.id) return;

		console.log(`Connecting to peer: ${peerId}`);
		this.hostId = peerId; // Запоминаем ID хоста
		const conn = this.peer.connect(peerId);
		this.setupConnection(conn);
	}

	private setupConnection(conn: DataConnection): void {
		conn.on('open', () => {
			console.log(`Connection with ${conn.peer} is open.`);
			this.connections.set(conn.peer, conn);
			this.emit('player-connected', conn.peer);
		});

		conn.on('data', (data: unknown) => {
			// Генерируем событие о получении данных
			this.emit('data-received', conn.peer, data as GameData);
		});

		conn.on('close', () => {
			console.log(`Connection with ${conn.peer} has closed.`);
			this.connections.delete(conn.peer);
			// Генерируем событие об отключении
			this.emit('player-disconnected', conn.peer);
		});

		conn.on('error', (err) => {
			console.error(`Connection error with ${conn.peer}:`, err);
		});
	}

	// Метод для отправки данных хосту
	public sendToHost(data: GameData): void {
		if (this.hostId && this.connections.has(this.hostId)) {
			this.connections.get(this.hostId)?.send(data);
		}
	}

	// Метод для хоста, чтобы разослать всем
	public broadcast(data: GameData): void {
		for (const conn of this.connections.values()) {
			conn.send(data);
		}
	}
}
