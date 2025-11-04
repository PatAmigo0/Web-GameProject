import type { Character } from '../Character';

export class AnimatorComponent {
	private character!: Character;

	constructor(character: Character) {
		this.character = character;
	}
}
