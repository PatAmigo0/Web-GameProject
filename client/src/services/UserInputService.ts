import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import type { Character } from '@components/entities/Character';
import { ACTION_MAP } from '@config/controls.config';
import { Keys, PHASER_KEYS } from '@config/keyboard.config';
import { injectInitializator } from '@decorators/InjectInitializator.decorator';
import { UISCharacterCheck } from '@decorators/UISCharacterCheck.decorator';
import type { Action, InputSignal, MappedKeyInfo } from '@gametypes/controls.types';
import { GameEvents, KeyboardEvents } from '@gametypes/event.types';

@injectInitializator((service: UserInputService) => {
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
		Object.entries(ACTION_MAP).forEach(([action, keyCode]) => {
			const phaserKeyCode = PHASER_KEYS[keyCode as keyof typeof PHASER_KEYS];

			if (phaserKeyCode) {
				this.keyMap.set(keyCode, {
					baseKey: keyCode,
					action: action as Action,
					phaserKey: phaserKeyCode,
				});
			} else {
				console.warn(
					`[UserInputService] не удалось получить код клавиши (${keyCode}) из хранилища, пропуск инициализации клавиши в KeyboardManager`,
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
			this.localCharacter.keyinput.changeInputState({
				action: keyInfo.action,
				state: key.type == KeyboardEvents.KEY_DOWN,
			});
		}
	}

	@UISCharacterCheck
	private resetInput(): void {
		this.localCharacter.keyinput.changeInputState(this.falsyInput);
	}
}
