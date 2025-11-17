import { Schema, type } from '@colyseus/schema';

export class BaseGameRoomState extends Schema {
	@type('string') mySynchronizedProperty: string = 'test';
}
