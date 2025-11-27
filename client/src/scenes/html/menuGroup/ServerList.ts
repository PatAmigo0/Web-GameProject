import { AbstractFormScene } from '@abstracts/scene-base/AbstractFormScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import type { JoinRoomDto } from '@game/shared';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { listenSubSceneChange } from '@utils/ui-utils/routing.util';
import * as Colyseus from 'colyseus.js';

interface RoomMetadata {
	roomName?: string;
	createdAt?: number | string;
	mode?: string;
}

@SceneInfo(SceneKeys.ServerList, SceneTypes.HTMLScene, { to: SceneKeys.CharacterTestPlace })
export class ServerListScene extends AbstractFormScene<JoinRoomDto, Colyseus.Room> {
	protected submitButton!: HTMLButtonElement;

	private backButton!: HTMLButtonElement;
	private serverList!: HTMLDivElement;

	private rooms: Colyseus.RoomAvailable<RoomMetadata>[] = [];
	private selectedRoomId: string | null = null;

	public onPreload(): void {
		this.load.rexAwait(async (successCallback, failureCallback) => {
			try {
				await this.loadRooms();
				successCallback();
			} catch (e) {
				this.logger.quietError('Во время загрузки комнат:', e);
				failureCallback();
			}
		});
	}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
		this.listRooms();
	}

	public heartbeat(): void {}

	public onShutdown(): void {}

	public wake(): void {
		super.wake();
		this.setLockState(false);
		this.loadRooms()
			.then(() => {
				this.listRooms();
			})
			.catch(console.error);
	}

	protected async getFormData(): Promise<JoinRoomDto | null> {
		if (!this.selectedRoomId) {
			return null;
		}
		return { roomId: this.selectedRoomId } as unknown as JoinRoomDto;
	}

	protected async sendRequest(dto: JoinRoomDto & { roomId: string }): Promise<Colyseus.Room> {
		return await this.game.roomService.joinRoom(dto.roomId);
	}

	protected onSuccess(_room: Colyseus.Room): void {
		this.logger.debug('Все прошло успешно, делигирую логику в roomService');
	}

	private _init_class_attributes() {
		this.backButton = this.div.querySelector('#back-btn');
		this.serverList = this.div.querySelector('#servers-list');
	}

	private _init_click_events() {
		listenSubSceneChange.call(this, this.backButton, SceneKeys.MainMenu);
	}

	private listRooms() {
		this.serverList.innerHTML = '';
		console.warn(this.rooms);

		if (this.rooms.length === 0) {
			return;
		}

		this.rooms.forEach((room) => {
			const meta = room.metadata || {};
			this.logger.warn('DATE:', (room as any).createdAt);
			const dateStr = meta.createdAt
				? new Date(meta.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
				: 'Now';

			const listItem = this.createListItem({
				name: meta.roomName || `Room ${room.roomId}`,
				id: room.roomId,
				playerCurrent: room.clients,
				playerMax: room.maxClients,
				date: dateStr,
			});

			listItem.onclick = (e) => {
				this.selectedRoomId = room.roomId;
				this.submitButton = e.currentTarget as HTMLButtonElement;
				this.submitForm();
			};

			this.serverList.append(listItem);
		});
	}

	private createListItem(config: {
		name: string;
		id: string;
		playerCurrent: number;
		playerMax: number;
		date: string;
	}) {
		const div = document.createElement('div');
		div.classList.add('server-item');

		div.innerHTML = `
            <div class="server-info">
                <div class="row-top">
                    <span class="room-name">${config.name}</span>
                    <span class="room-id">ID: ${config.id}</span>
                </div>
                <div class="row-bottom">
                    <div class="stat-badge ${config.playerCurrent >= config.playerMax ? 'full' : ''}">
                        <span class="label">ИГРОКИ:</span>
                        <span class="value">${config.playerCurrent} / ${config.playerMax}</span>
                    </div>
                    <div class="stat-badge">
                        <span class="label">СОЗДАНО:</span>
                        <span class="value">${config.date}</span>
                    </div>
                </div>
            </div>
            <div class="action-icon">➜</div>
        `;

		return div;
	}

	private async loadRooms() {
		const response = await this.game.colyseusService.getRooms();
		this.rooms = Array.isArray(response) ? response : [];
	}
}
