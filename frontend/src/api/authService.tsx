import { GetServerSidePropsContext } from 'next';

import { HeaderInfo } from 'types/dashboard/header.info';
import { Token } from 'types/token';
import { CreateOrLogin } from 'types/user/create-login.user';
import {
	EmailUser,
	LoginUser,
	NewPassword,
	RegisterUser,
	ResetPasswordResponse,
	ResetTokenResponse,
	User
} from 'types/user/user';
import fetchData from 'utils/fetchData';

export const getDashboardHeaderInfo = (
	context?: GetServerSidePropsContext
): Promise<HeaderInfo> => {
	return fetchData(`auth/statistics`, { context, serverSide: !!context });
};

export const registerNewUser = (newUser: RegisterUser): Promise<User> => {
	return fetchData('/auth/register', { method: 'POST', data: newUser, serverSide: false });
};

export const login = (credentials: LoginUser): Promise<User> => {
	return fetchData('/auth/login', { method: 'POST', data: credentials, serverSide: true });
};

<<<<<<< HEAD
export const checkUserExistsAD = (email: string): Promise<'az' | 'local' | false> => {
	return fetchData(`/auth/azure/user/${email}`, { method: 'HEAD' });
};

export const checkUserExists = (email: string): Promise<'az' | 'local' | boolean> => {
	return fetchData(`/auth/user/${email}`, { method: 'HEAD' });
=======
export const checkUserExists = (email: string): Promise<'az' | 'local' | boolean> => {
	return fetchData(`/auth/user/${email}`, { method: 'HEAD' });
};

export const checkUserExistsAD = (email: string): Promise<'az' | 'local' | false> => {
	return fetchData(`/auth/azure/user/${email}`, { method: 'HEAD' });
>>>>>>> c64241d (feat: change routes and req method for check email endpoint in frontend for azure)
};

export const createOrLoginUserAzure = (azureAccessToken: string): Promise<CreateOrLogin> => {
	return fetchData(`/auth/azure`, {
		method: 'POST',
		data: { token: azureAccessToken },
		serverSide: true
	});
};

export const resetTokenEmail = (email: EmailUser): Promise<ResetTokenResponse> => {
	return fetchData(`/auth/password/reset`, { method: 'PATCH', data: email });
};

export const refreshAccessToken = (token: string): Promise<Token> => {
	return fetchData('/auth/refresh', { refreshToken: token, serverSide: true });
};

export const resetUserPassword = (params: NewPassword): Promise<ResetPasswordResponse> => {
	return fetchData('/auth/password', {
		method: 'PATCH',
		data: params
	});
};
