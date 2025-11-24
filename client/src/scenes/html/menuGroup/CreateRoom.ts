import { BaseHtmlScene } from '@abstracts/scene-base/BaseHtmlScene';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { roomCreateSchema, roomNameSchemaRule, type CreateRoomDto } from '@game/shared';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { handleInputFormation } from '@utils/ui-utils/forms.util';
import { listenSubSceneChange } from '@utils/ui-utils/routing.util';

@SceneInfo(SceneKeys.CreateRoom, SceneTypes.HTMLScene)
export class CreateRoomScene extends BaseHtmlScene {
	private backButton!: HTMLButtonElement;
	private playersRange!: HTMLInputElement;
	private playersCountDisplay!: HTMLSpanElement;
	private roomNameInput!: HTMLInputElement;
	private createButton!: HTMLButtonElement;
	private privateCheckbox!: HTMLInputElement;

	private locked = false;

	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_click_events();
	}

	public heartbeat(): void {}

	public onShutdown(): void {}

	private _init_class_attributes() {
		this.backButton = this.div.querySelector('#back-btn');
		this.playersRange = this.div.querySelector('#players-range');
		this.playersCountDisplay = this.div.querySelector('#players-count-display');
		this.roomNameInput = this.div.querySelector('#room-name');
		this.createButton = this.div.querySelector('#create-confirm-btn');
		this.privateCheckbox = this.div.querySelector('#is-private');
	}

	private _init_click_events() {
		listenSubSceneChange.call(this, this.backButton, SceneKeys.MainMenu);

		this.listenEvent({
			element: this.roomNameInput,
			event: 'input',
			callback: () => {
				handleInputFormation.call(this, this.roomNameInput, roomNameSchemaRule);
			},
		});

		this.listenEvent({
			element: this.playersRange,
			event: 'input',
			callback: () => {
				this.playersCountDisplay.innerText = this.playersRange.value;
			},
		});

		this.listenEvent({
			element: this.createButton,
			event: 'click',
			callback: () => {
				if (this.locked) return;
				const createRoomDto = {
					roomName: this.roomNameInput.value,
					playersAmount: this.playersRange.valueAsNumber,
					isPrivate: this.privateCheckbox.checked,
				} as CreateRoomDto;

				if (!this.game.validatorService.validateData({ body: createRoomDto }, roomCreateSchema)) {
					this.game.notificationService.show('Неверные данные для создания комнаты', 'error');
					return;
				}
			},
		});
	}
}
