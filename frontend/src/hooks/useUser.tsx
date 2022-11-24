import { useMutation } from 'react-query';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { AxiosError } from 'axios';

import { resetTokenEmail, resetUserPassword } from '@/api/authService';
import {
  EmailUser,
  NewPassword,
  ResetPasswordResponse,
  ResetTokenResponse,
  UseUserType,
} from '@/types/user/user';
import { DASHBOARD_ROUTE } from '@/utils/routes';

const useUser = (): UseUserType => {
  const resetToken = useMutation<ResetTokenResponse, AxiosError, EmailUser>(
    (emailUser: EmailUser) => resetTokenEmail(emailUser),
    {
      mutationKey: 'forgotPassword',
      onSuccess: async (response: ResetTokenResponse) => response.message,
    },
  );

  const resetPassword = useMutation<ResetPasswordResponse, AxiosError, NewPassword>(
    (data: NewPassword) => resetUserPassword(data),
    {
      mutationKey: 'resetPassword',
      onSuccess: async (response: ResetPasswordResponse) => response.message,
    },
  );

  const loginAzure = async () => {
    signIn<RedirectableProviderType>('azure-ad', {
      callbackUrl: DASHBOARD_ROUTE,
      redirect: true,
    });
  };

  return { loginAzure, resetToken, resetPassword };
};

export default useUser;
