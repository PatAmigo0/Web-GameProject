import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import type { Character } from '@components/entities/Character';
import type { Logger } from '@components/shared/LoggerComponent';
import { ACTION_MAP } from '@config/controls.config';
import { Keys, PHASER_KEYS } from '@config/keyboard.config';
import { injectInitializator } from '@decorators/injectInitializator.decorator';
import { injectLogger } from '@decorators/injectLogger.decorator';
import { UISCharacterCheck } from '@decorators/UISCharacterCheck.decorator';
import type { Action, ActionKeyValues, InputSignal, MappedKeyInfo } from '@gametypes/controls.types';
import { GameEvents, KeyboardEvents } from '@gametypes/event.types';

@injectLogger()
@injectInitializator(async (service: UserInputService) => {
	service.initAttributes();
	service.initKeys();
	service.initEvents();
	service.listenEvents();
})
export class UserInputService extends StandaloneService {
	public localCharacter: Character | null = null;
	private keyMap = new Map<Keys, MappedKeyInfo>();
	private target!: EventTarget;
	private falsyInput: InputSignal[] = [];
	private declare logger: Logger;

	constructor(
		private keyboard: Phaser.Input.Keyboard.KeyboardManager,
		private events: Phaser.Events.EventEmitter,
	) {
		super();
	}

	public setLocalCharacter(character: Character): void {
		this.localCharacter = character;
	}

	public removeLocalCharacer(): void {
		this.localCharacter = null;
	}

	public lockMainKeys(): void {
		this.toggleKeyCapture(true);
	}

	public unlockMainKeys(): void {
		this.toggleKeyCapture(false);
	}

	public declare init: () => void;

	private initAttributes(): void {
		this.target = this.keyboard.target;
		for (const actionKey of Object.keys(ACTION_MAP)) {
			this.falsyInput.push({ action: actionKey as Action, state: false });
		}
	}

	private initKeys(): void {
		(Object.entries(ACTION_MAP) as [Action, ActionKeyValues][]).forEach(([action, keyCode]) => {
			const phaserKeyCode = PHASER_KEYS[keyCode];

			if (phaserKeyCode) {
				this.keyMap.set(keyCode, {
					baseKey: keyCode,
					action: action,
					phaserKey: phaserKeyCode,
				});
			} else {
				this.logger.warn(
					`Не удалось получить код клавиши (${keyCode}) из хранилища, пропуск инициализации клавиши в KeyboardManager`,
				);
			}
		});

		this.lockMainKeys(); // locking by default
	}

	private initEvents(): void {
		const handler = (key: Event) => this.emit(KeyboardEvents.KEY_PRESSED, key as KeyboardEvent);
		this.target.addEventListener(KeyboardEvents.KEY_DOWN, handler, false);
		this.target.addEventListener(KeyboardEvents.KEY_UP, handler, false);
	}

	private listenEvents(): void {
		this.on(KeyboardEvents.KEY_PRESSED, (key: KeyboardEvent) => {
			if (this.keyMap.has(key.code as Keys)) {
				this.handleKeyPressed(key);
			}
		});
		this.events.on(GameEvents.INPUT_RESET, () => this.resetInput());
	}

	private toggleKeyCapture(lock: boolean): void {
		const method = lock ? 'addCapture' : 'removeCapture';

		for (const keyInfo of this.keyMap.values()) {
			this.keyboard[method](keyInfo.phaserKey);
		}
	}

	@UISCharacterCheck
	private handleKeyPressed(key: KeyboardEvent): void {
		const keyInfo = this.keyMap.get(key.code as Keys);
		if (keyInfo && !key.repeat) {
			const actionObject = {
				action: keyInfo.action,
				state: key.type == KeyboardEvents.KEY_DOWN,
			};
			this.localCharacter.keyinput.changeInputState(actionObject);
		}
	}

	@UISCharacterCheck
	private resetInput(): void {
		this.localCharacter.keyinput.changeInputState(this.falsyInput);
	}
}
