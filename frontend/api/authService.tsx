import { GetServerSidePropsContext } from "next";
import { HeaderInfo } from "../types/dashboard/header.info";
import { Token } from "../types/token";
import { CreateOrLogin } from "../types/user/create-login.user";
import { User, LoginUser, RegisterUser } from "../types/user/user";
import { User, LoginUser, EmailUser, ResetTokenResponse } from "../types/user/user";
import fetchData from "../utils/fetchData";

export const registerNewUser = (newUser: RegisterUser): Promise<User> => {
	return fetchData('/auth/register', { method: 'POST', data: newUser, serverSide: true });
};

export const login = (credentials: LoginUser): Promise<User> => {
	return fetchData('/auth/login', { method: 'POST', data: credentials, serverSide: true });
};

export const checkUserExistsAD = (email: string): Promise<'az' | 'local' | false> => {
	return fetchData(`/auth/checkUserEmailAD/${email}`);
};

export const checkUserExists = (email: string): Promise<'az' | 'local' | boolean> => {
	return fetchData(`/auth/checkUserEmail/${email}`);
};

export const createOrLoginUserAzure = (azureAccessToken: string): Promise<CreateOrLogin> => {
	return fetchData(`/auth/signAzure`, {
		method: 'POST',
		data: { token: azureAccessToken },
		serverSide: true
	});
};

export const resetTokenEmail = (email: EmailUser): Promise<ResetTokenResponse> => {
  return fetchData(`/auth/recoverPassword`, { method: "POST", data: email });
};

export const refreshAccessToken = (token: string): Promise<Token> => {
	return fetchData('/auth/refresh', { refreshToken: token, serverSide: true });
};

export const getDashboardHeaderInfo = (
	context?: GetServerSidePropsContext
): Promise<HeaderInfo> => {
	return fetchData(`auth/dashboardStatistics`, { context, serverSide: !!context });
};
