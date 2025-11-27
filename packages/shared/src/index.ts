import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import z, { email } from 'zod';

//#region USER SPECIAL

export const MIN_LOGIN_LENGTH = 4;
export const MAX_LOGIN_LENGTH = 16;

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 18;

export const MIN_ROOM_NAME_LENGTH = 3;
export const MAX_ROOM_NAME_LENGTH = 12;

export const MIN_ROOM_PLAYERS = 3;
export const MAX_ROOM_PLAYERS = 12;

export const INVITE_CODE_LENGTH = 12;

//#endregion

//#region ZOD ERROR MESSAGES
export enum ValidationMessage {
	LoginTooShort = 'Login is too short',
	LoginTooLong = 'Login is too long',
	PasswordTooShort = 'Password is too short',
	PasswordTooLong = 'Password is too long',
	RoomNameTooShort = 'Room name is too short',
	RoomNameTooLong = 'Room name is too long',
	OnlyEnglish = 'Only english allowed',
	InvalidEmail = 'Invalid email',
	InvalidInviteCode = 'Wrong invite code',
	Required = 'Field is required',
}
//#endregion

//#region AUTH RULES (INDIVIDUAL)
const optionFormater = (
	error: string,
): {
	abort?: boolean | undefined;
	error?: string | undefined;
	message?: string | undefined;
} => {
	return {
		abort: false,
		error: error,
	};
};

const ENGLISH_REGEX = /^[a-zA-Z0-9_]+$/;

export const loginSchemaRule = z
	.string(optionFormater(ValidationMessage.Required))
	.trim()
	.min(MIN_LOGIN_LENGTH, optionFormater(ValidationMessage.LoginTooShort))
	.max(MAX_LOGIN_LENGTH, optionFormater(ValidationMessage.LoginTooLong))
	.regex(ENGLISH_REGEX, optionFormater(ValidationMessage.OnlyEnglish));

export const passwordSchemaRule = z
	.string(optionFormater(ValidationMessage.Required))
	.trim()
	.min(MIN_PASSWORD_LENGTH, optionFormater(ValidationMessage.PasswordTooShort))
	.max(MAX_PASSWORD_LENGTH, optionFormater(ValidationMessage.PasswordTooLong))
	.regex(ENGLISH_REGEX, optionFormater(ValidationMessage.OnlyEnglish));

export const emailSchemaRule = email(ValidationMessage.InvalidEmail).optional();

export const inviteCodeSchemaRule = z
	.string()
	.length(INVITE_CODE_LENGTH, optionFormater(ValidationMessage.InvalidInviteCode))
	.optional();

export const roomNameSchemaRule = z
	.string(optionFormater(ValidationMessage.Required))
	.trim()
	.min(MIN_ROOM_NAME_LENGTH, optionFormater(ValidationMessage.RoomNameTooShort))
	.max(MAX_ROOM_NAME_LENGTH, optionFormater(ValidationMessage.RoomNameTooLong))
	.regex(ENGLISH_REGEX, optionFormater(ValidationMessage.OnlyEnglish));

export const roomPlayersAmountRule = z.coerce
	.number(optionFormater(ValidationMessage.Required))
	.min(MIN_ROOM_PLAYERS)
	.max(MAX_ROOM_PLAYERS);

export const roomPrivateShemaRule = z.boolean(optionFormater(ValidationMessage.Required)).default(false);

export const shortCodeSchemaRule = z.coerce
	.string(optionFormater(ValidationMessage.Required))
	.length(6)
	.regex(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/);

//#endregion

//#region AUTH SCHEMAS (OBJECTS)
export const credentialsBase = z.object({
	login: loginSchemaRule,
	password: passwordSchemaRule,
});

export const registerSchema = z.object({
	body: credentialsBase.extend({
		email: emailSchemaRule,
		inviteCode: inviteCodeSchemaRule,
	}),
});

export const loginSchema = z.object({
	body: credentialsBase,
});

export type AuthCredentials = z.infer<typeof credentialsBase>;
export type RegisterDto = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];
export type AuthDto = RegisterDto | LoginDto;
//#endregion

//#region GAME SCHEMAS (OBJECTS)
export const roomCreateSchema = z.object({
	body: z.object({
		roomName: roomNameSchemaRule,
		playersAmount: roomPlayersAmountRule,
		isPrivate: roomPrivateShemaRule,
	}),
});

export const roomJoinSchema = z.object({
	params: z.object({
		code: shortCodeSchemaRule,
	}),
});

export type CreateRoomDto = z.infer<typeof roomCreateSchema>['body'];
export type JoinRoomDto = z.infer<typeof roomJoinSchema>['params'];
//#endregion

//#region HTTP QUERIES TYPES
export interface AuthQueryHeader {
	Authorization: string;
}

export enum HttpStatus {
	OK = 200,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	Conflict = 409,
	ZodValidationError = 422,
	TooManyRequests = 429,
	InternalServerError = 500,
	ServiceUnavailable = 503,
}

export enum ErrorCode {
	AuthInvalidToken = 'AUTH_ERROR_INVALID_TOKEN',
	AuthExpired = 'AUTH_ERROR_TOKEN_EXPIRED',

	InformationCorrupted = 'INFORMATION_CORRUPTED', // Означает что переданная информация не подходит / неверна
	BadJson = 'BAD_JSON',
	LoginTaken = 'LOGIN_TAKEN',

	UserNotFound = 'USER_NOT_FOUND',
	UserNotAllowed = 'USER_NOT_ALLOWED',
	UserWrongPassword = 'USER_WRONG_PASSWORD',
	UserBanned = 'USER_BANNED',

	RoomNotFound = 'ROOM_NOT_FOUND',

	CorsNotAllowed = 'CORS_NOT_ALLOWED',

	ServerError = 'NON_CRITICAL_SERVER_ERROR',

	// Critical
	CriticalServerError = 'CRITICAL_SERVER_ERROR',
	RateLimitExceed = 'RATE_LIMIT_EXCEED',
}

export enum OkCode {
	SuccessRegistration = 'SUCCESS_REGISTRATION',
	SuccesLogin = 'SUCCESS_LOGIN',
	RoomCreated = 'ROOM_CREATED',
	RoomJoin = 'ROOM_JOIN',
	RoomsListed = 'ROOMS_LISTED',
	NoDataSpecified = 'NO_DATA',
}

export interface QueryError {
	code: ErrorCode;
	message?: string;
}

//#endregion

//#region ETC

export interface JwtAuthPayload {
	uuid: string;
	username: string;
}

//#endregion

//#region RESPONSES

export interface ApiResponse {
	error?: QueryError;
	data?: unknown;
}

export interface AuthRequest extends Request {
	user?: string | JwtPayload;
}

export interface AuthResponse extends ApiResponse {
	data: {
		token: string;
		uuid: string;
	};
}

export interface RoomResponse extends ApiResponse {
	data: {
		roomId: string;
		code?: string;
	};
}

//#endregion

//#region ROOM TYPES

export enum RoomTypes {
	BaseGameRoom = 'baseGameRoom',
	LobbyRoom = 'lobbyRoom',
}

//#endregion

//#region ENV

export const VITE_PORT = 1234;
export const HOST_PORT = 2567;
export const SERVER_HOST = `localhost:${HOST_PORT}`;
export const CLIENT_LOCAL_HOST = `localhost:${VITE_PORT}`;

//#endregion

//#region COLYSEUS SCHEMAS
import { MapSchema, Schema, type } from '@colyseus/schema';

export class Player extends Schema {
	@type('string') id: string = '';
	@type('string') username: string = '';
	@type('string') skin: string = 'default';
	@type('number') x: number = 0;
	@type('number') y: number = 0;
	@type('string') anim: string = 'idle';
}

export class BaseGameRoomState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
}

//#endregion
