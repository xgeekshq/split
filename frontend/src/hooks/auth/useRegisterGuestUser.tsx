import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { useSetRecoilState } from 'recoil';

import { registerGuest } from '@/api/authService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { GUEST_USER_COOKIE } from '@/utils/constants';
import { ToastStateEnum } from '@/utils/enums/toast-types';

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
