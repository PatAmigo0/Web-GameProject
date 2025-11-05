import { StandaloneService } from '@abstracts/service/StandaloneService';
import type { Character } from '@components/entities/Character';
import { KEYBOARD_LISTENING_KEYS } from '@config/controls.config';
import { KEYBOARD_EVENT_TYPES } from '@config/events.config';
import { PhaserKeys } from '@config/keyboard.config';

export class UserInputService extends StandaloneService {
	private localCharacter: Character | null = null;
	private keyboard!: Phaser.Input.Keyboard.KeyboardManager;
	private keyMap = new Map<string, string>();
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

	private handleKeyDown(e: KeyboardEvent) {
		console.log(e);
	}

	private handleKeyUp(e: KeyboardEvent) {
		console.log(e);
	}

	public init(): void {
		this.initAttributes();
		this.initKeys();
		this.initEvents();
		this.listenEvents();
	}

	private initAttributes() {
		this.target = this.keyboard.target;
	}

	private initKeys() {
		// W, A, S, D
		Object.entries(KEYBOARD_LISTENING_KEYS).forEach(
			([eventName, keyCode]) => {
				this.keyMap.set(keyCode, eventName);
				const phaserKeyCode = PhaserKeys[keyCode];
				if (phaserKeyCode) {
					this.keyboard.addCapture(phaserKeyCode);
				} else {
					console.warn(
						`[UserInputService] не удалось получить код клавиши из хранилища, пропуск инициализации клавиши в KeyboardManager`,
					);
				}
			},
		);
	}

	private initEvents() {
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

	private listenEvents() {
		this.on(KEYBOARD_EVENT_TYPES.KEY_PRESSED, (key: KeyboardEvent) => {
			if (this.keyMap.has(key.code)) {
				switch (key.type) {
					case KEYBOARD_EVENT_TYPES.KEY_DOWN:
						this.handleKeyDown(key);
						break;
					case KEYBOARD_EVENT_TYPES.KEY_UP:
						this.handleKeyUp(key);
						break;
					default:
						console.warn(
							`Событие типа ${key.type} не поддерживается`,
						);
				}
			}
		});
	}
}
