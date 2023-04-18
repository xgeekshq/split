import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { useSetRecoilState } from 'recoil';

import { registerGuest } from '@/api/authService';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/auth-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { GUEST_USER_COOKIE } from '@/utils/constants';

const useRegisterGuestUser = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation(registerGuest, {
    onSuccess: (data) => {
      setCookie(GUEST_USER_COOKIE, data);
    },
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.GUEST_USER));
    },
  });
};

export default useRegisterGuestUser;
