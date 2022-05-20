import { Nullable } from '../common';
import { AccessToken, RefreshToken } from '../token';

export interface User {
	id?: string;
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	passwordConf?: string;
	accessToken?: AccessToken;
	refreshToken?: RefreshToken;
	isSAdmin: boolean;
	joinedAt: string;
}

export interface UseUserType {
	loginAzure: () => Promise<void>;
}

export interface LoginUser {
	email: Nullable<string>;
	password: Nullable<string>;
}

export interface EmailUser {
	email: string;
}

export interface RegisterUser {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export type UserZod = 'name' | 'email' | 'password' | 'passwordConf';
