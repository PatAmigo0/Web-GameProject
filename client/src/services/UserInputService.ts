import { StandaloneService } from '@abstracts/service/StandaloneService';
import type { Character } from '@components/entities/Character';
import { KEYBOARD_LISTENING_KEYS as ListenableKeyCodes } from '@config/controls.config';
import { KEYBOARD_EVENT_TYPES } from '@config/events.config';
import { PhaserKeys } from '@config/keyboard.config';
import type { KeyInformation } from '@gametypes/player.types';

export class UserInputService extends StandaloneService {
	private localCharacter: Character | null = null;
	private keyMap = new Map<ListenableKeyCodes, KeyInformation>();
	private keyboard!: Phaser.Input.Keyboard.KeyboardManager;
	private target!: EventTarget;

	constructor(keyboard: Phaser.Input.Keyboard.KeyboardManager) {
		super();
		this.keyboard = keyboard;
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

	public init(): void {
		this.initAttributes();
		this.initKeys();
		this.initEvents();
		this.listenEvents();
	}

	private initAttributes(): void {
		this.target = this.keyboard.target;
	}

	private initKeys(): void {
		// W, A, S, D
		Object.entries(ListenableKeyCodes).forEach(([eventName, keyCode]) => {
			const phaserKeyCode = PhaserKeys[keyCode];
			if (phaserKeyCode) {
				this.keyMap.set(keyCode, {
					eventName: eventName,
					phaserKey: phaserKeyCode,
				});
			} else {
				console.warn(
					`[UserInputService] не удалось получить код клавиши (${keyCode}) из хранилища, пропуск инициализации клавиши в KeyboardManager`,
				);
			}
		});

		this.lockMainKeys();
	}

	private initEvents(): void {
		const handler = (key: Event) =>
			this.emit(KEYBOARD_EVENT_TYPES.KEY_PRESSED, key as KeyboardEvent);

		this.target.addEventListener(
			KEYBOARD_EVENT_TYPES.KEY_DOWN,
			handler,
			false,
		);

		this.target.addEventListener(
			KEYBOARD_EVENT_TYPES.KEY_UP,
			handler,
			false,
		);
	}

	private listenEvents(): void {
		this.on(KEYBOARD_EVENT_TYPES.KEY_PRESSED, (key: KeyboardEvent) => {
			if (this.keyMap.has(key.code as ListenableKeyCodes)) {
				this.handleKeyPressed(key);
			}
		});
	}

	private handleKeyPressed(key: KeyboardEvent): void {
		if (this.localCharacter) {
			const keycode = key.code as ListenableKeyCodes;
			this.localCharacter.keyinput.changeInputState({
				key: keycode,
				state: key.type == KEYBOARD_EVENT_TYPES.KEY_DOWN, // true если key down, false если key up
			});
			console.log({
				key: keycode,
				state: key.type == KEYBOARD_EVENT_TYPES.KEY_DOWN, // true если key down, false если key up
			});
		}
	}

	private toggleKeyCapture(lock: boolean): void {
		const method = lock ? 'addCapture' : 'removeCapture';

		for (const keyInfo of this.keyMap.values()) {
			this.keyboard[method](keyInfo.phaserKey);
		}
	}
}
