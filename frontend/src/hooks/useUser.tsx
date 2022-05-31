/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';

import { UseUserType } from 'types/user/user';
import { transformLoginErrorCodes } from 'utils/errorCodes';
import { DASHBOARD_ROUTE } from 'utils/routes';

const useUser = (setErrorCode: Dispatch<SetStateAction<number>>): UseUserType => {
	const router = useRouter();

	const loginAzure = async () => {
		const loginResult = await signIn<RedirectableProviderType>('azure-ad', {
			callbackUrl: DASHBOARD_ROUTE,
			redirect: false
		});
		if (loginResult?.error) {
			setErrorCode(transformLoginErrorCodes(loginResult.error));
			return;
		}
		router.push(DASHBOARD_ROUTE);
	};

	return { loginAzure };
};

export default useUser;
