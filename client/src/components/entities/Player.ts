import type { Character } from '@components/entities/Character';

export class Player {
	private _userID!: string;
	private _character!: Character;

	get character(): Character {
		return this._character;
	}

	get userID(): string {
		return this._userID;
	}
}
