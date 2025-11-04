import type { Character } from '../Character';

export class InputComponent {
	private character!: Character;

	constructor(character: Character) {
		this.character = character;
	}
}
