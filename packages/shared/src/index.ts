import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import z, { email } from 'zod';

//#region AUTH TYPES
export const credentialsBase = z.object({
	login: z.string().min(3, 'Login is too short').max(12, 'Login is too long'),
	password: z.string().min(6, 'Password is too short').max(20, 'Password is too long'),
});

export const registerSchema = z.object({
	body: credentialsBase.extend({
		email: email().optional(),
		inviteCode: z.string().max(12).optional(),
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
	ZodValidationError = 422,
	InternalServerError = 500,
}

export enum ErrorCode {
	AuthInvalidToken = 'AUTH_ERROR_INVALID_TOKEN',
	AuthExpired = 'AUTH_ERROR_TOKEN_EXPIRED',

	InformationCorrupted = 'INFORMATION_CORRUPTED', // Означает что переданная информация не подходит / неверна
	LoginTaken = 'LOGIN_TAKEN',

	UserNotFound = 'USER_NOT_FOUND',
	UserNotAllowed = 'USER_NOT_ALLOWED',
	UserBanned = 'USER_BANNED',

	// Critical
	CriticalServerError = 'CriticalServerError',
}

export interface ApiResponse {
	status: HttpStatus;
	error?: ErrorCode;
	message?: string;
	data?: unknown;
}

export interface AuthRequest extends Request {
	user?: string | JwtPayload;
}

export interface AuthResponse extends ApiResponse {
	jwt_token: string;
}

//#endregion
