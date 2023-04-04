import { useMutation } from '@tanstack/react-query';

import { registerGuest } from '@/api/authService';
import { setCookie } from 'cookies-next';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { GUEST_USER_COOKIE } from '@/utils/constants';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

const useRegisterGuestUser = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation(registerGuest, {
    onSuccess: (data) => {
      setCookie(GUEST_USER_COOKIE, data);
    },
    onError: () => {
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: 'Error login guest user',
      });
    },
  });
};

export default useRegisterGuestUser;
