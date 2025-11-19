import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import z, { email } from 'zod';

//#region USER SPECIAL

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_LOGIN_LENGTH = 3;
export const MAX_LOGIN_LENGTH = 16;
export const MAX_PASSWORD_LENGTH = 18;
export const INVITE_CODE_LENGTH = 12;

//#endregion

//#region AUTH TYPES
export const credentialsBase = z.object({
	login: z.string().min(MIN_LOGIN_LENGTH, 'Login is too short').max(MAX_LOGIN_LENGTH, 'Login is too long'),
	password: z
		.string()
		.min(MIN_PASSWORD_LENGTH, 'Password is too short')
		.max(MAX_PASSWORD_LENGTH, 'Password is too long'),
});

export const registerSchema = z.object({
	body: credentialsBase.extend({
		email: email().optional(),
		inviteCode: z.string().length(INVITE_CODE_LENGTH, 'Wrong invite code').optional(),
	}),
});

export const loginSchema = z.object({
	body: credentialsBase,
});

export type AuthCredentials = z.infer<typeof credentialsBase>;
export type RegisterDto = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];
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

	CorsNotAllowed = 'CORS_NOT_ALLOWED',

	// Critical
	CriticalServerError = 'CRITICAL_SERVER_ERROR',
	RateLimitExceed = 'RATE_LIMIT_EXCEED',
}

export enum OkCode {
	SuccessRegistration = 'SUCCESS_REGISTRATION',
	SuccesLogin = 'SUCCESS_LOGIN',
	NoDataSpecified = 'NO_DATA',
}

export interface QueryError {
	code: ErrorCode;
	message?: string;
}

export interface ApiResponse {
	error?: QueryError;
	data?: unknown;
}

export interface AuthRequest extends Request {
	user?: string | JwtPayload;
}

//#endregion

//#region ENV

const envValue = typeof process !== 'undefined' ? process.env.VITE_SERVER_HOST : undefined;
export const SERVER_HOST = envValue || 'localhost:2567';
export const VITE_PORT = 1234;

//#endregion
