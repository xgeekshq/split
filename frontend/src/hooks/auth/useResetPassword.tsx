import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { resetUserPassword } from '@/api/authService';
import { USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/auth-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useResetPassword = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation([USERS_KEY, 'resetPassword'], resetUserPassword, {
    onSuccess: () => {
      setToastState(createSuccessMessage(SuccessMessages.RESET_PASSWORD));
    },
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.RESET_PASSWORD));
    },
  });
};

export default useResetPassword;
