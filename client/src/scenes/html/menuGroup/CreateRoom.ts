import { AbstractFormScene } from '@core/abstracts/scene-base/AbstractFormScene'; // Путь к новому классу
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { type CreateRoomDto, roomCreateSchema, roomNameSchemaRule } from '@game/shared';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';
import { handleInputFormation } from '@utils/ui-utils/forms.util';
import { listenSubSceneChange } from '@utils/ui-utils/routing.util';

@SceneInfo(SceneKeys.CreateRoom, SceneTypes.HTMLScene)
export class CreateRoomScene extends AbstractFormScene<CreateRoomDto> {
	protected submitButton!: HTMLButtonElement;

	private backButton!: HTMLButtonElement;
	private playersRange!: HTMLInputElement;
	private playersCountDisplay!: HTMLSpanElement;
	private roomNameInput!: HTMLInputElement;
	private privateCheckbox!: HTMLInputElement;

	public onPreload(): void {}

	public onCreate(): void {
		this._init_class_attributes();
		this._init_events();
	}

	public heartbeat(): void {}
	public onShutdown(): void {}

	private _init_class_attributes() {
		this.submitButton = this.div.querySelector('#create-confirm-btn') as HTMLButtonElement;
		this.backButton = this.div.querySelector('#back-btn') as HTMLButtonElement;
		this.playersRange = this.div.querySelector('#players-range') as HTMLInputElement;
		this.playersCountDisplay = this.div.querySelector('#players-count-display') as HTMLSpanElement;
		this.roomNameInput = this.div.querySelector('#room-name') as HTMLInputElement;
		this.privateCheckbox = this.div.querySelector('#is-private') as HTMLInputElement;
	}

	private _init_events() {
		listenSubSceneChange.call(this, this.backButton, SceneKeys.MainMenu);

		this.listenEvent({
			element: this.submitButton,
			event: 'click',
			callback: () => this.submitForm(),
		});

		this.listenEvent({
			element: this.playersRange,
			event: 'input',
			callback: () => {
				this.playersCountDisplay.innerText = this.playersRange.value;
			},
		});

		this.listenEvent({
			element: this.roomNameInput,
			event: 'input',
			callback: () => handleInputFormation.call(this, this.roomNameInput, roomNameSchemaRule),
		});
	}

	protected async getFormData(): Promise<CreateRoomDto | null> {
		const dto: CreateRoomDto = {
			roomName: this.roomNameInput.value,
			playersAmount: this.playersRange.valueAsNumber,
			isPrivate: this.privateCheckbox.checked,
		};

		const isValid = this.game.validatorService.validateData({ body: dto }, roomCreateSchema);
		if (!isValid) {
			this.onError('Неверные данные для создания комнаты');
			return null;
		}

		return dto;
	}

	protected async sendRequest(_data: CreateRoomDto): Promise<Response> {
		return new Response(JSON.stringify({ ok: true }));
	}

	protected async onSuccess(response: Response): Promise<void> {
		const data = await response.json();
		if (response.ok) {
		} else {
			this.game.notificationService.show(`Ошибка: ${data.message}`, 'error');
		}
	}
}
