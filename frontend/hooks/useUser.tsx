import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import { useMutation } from 'react-query';

import { resetTokenEmail, resetUserPassword } from '../api/authService';
import {
	EmailUser,
	NewPassword,
	ResetPasswordResponse,
	ResetTokenResponse,
	UseUserType
} from '../types/user/user';
import { transformLoginErrorCodes } from '../utils/errorCodes';
import { DASHBOARD_ROUTE } from '../utils/routes';

const useUser = (setErrorCode?: Dispatch<SetStateAction<number>>): UseUserType => {
	const router = useRouter();

	const resetToken = useMutation<ResetTokenResponse, AxiosError, EmailUser>(
		(emailUser: EmailUser) => resetTokenEmail(emailUser),
		{
			mutationKey: 'forgotPassword',
			onSuccess: async (response: ResetTokenResponse) => {
				return response.message;
			}
		}
	);

	const resetPassword = useMutation<ResetPasswordResponse, AxiosError, NewPassword>(
		(data: NewPassword) => resetUserPassword(data),
		{
			mutationKey: 'resetPassword',
			onSuccess: async (response: ResetPasswordResponse) => {
				return response.message;
			}
		}
	);

	const loginAzure = async () => {
		const loginResult = await signIn<RedirectableProviderType>('azure-ad', {
			callbackUrl: DASHBOARD_ROUTE,
			redirect: false
		});
		if (loginResult?.error && setErrorCode) {
			setErrorCode(transformLoginErrorCodes(loginResult.error));
			return;
		}
		router.push(DASHBOARD_ROUTE);
	};

	return { loginAzure, resetToken, resetPassword };
};

export default useUser;
