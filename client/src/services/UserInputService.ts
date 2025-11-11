import { StandaloneService } from '@abstracts/service-base/StandaloneService';
import type { Character } from '@components/entities/Character';
import { ACTION_MAP } from '@config/controls.config';
import { Keys, PHASER_KEYS } from '@config/keyboard.config';
import type { Action, MappedKeyInfo } from '@gametypes/controls.types';
import { KeyboardEvents } from '@gametypes/event.types';

export class UserInputService extends StandaloneService {
	private localCharacter: Character | null = null;
	private keyMap = new Map<Keys, MappedKeyInfo>();
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
	}

	private handleKeyPressed(key: KeyboardEvent): void {
		const keyInfo = this.keyMap.get(key.code as Keys);

		if (this.localCharacter && !key.repeat && keyInfo) {
			this.localCharacter.keyinput.changeInputState({
				action: keyInfo.action,
				state: key.type == KeyboardEvents.KEY_DOWN,
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
