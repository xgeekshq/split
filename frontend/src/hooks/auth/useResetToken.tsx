import { useMutation } from '@tanstack/react-query';

import { resetTokenEmail } from '@/api/authService';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { USERS_KEY } from '@/utils/constants/reactQueryKeys';

const useResetToken = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation([USERS_KEY, 'forgotPassword'], resetTokenEmail, {
    onSuccess: (res) => {
      let toastMessage = '';
      if (res.message === 'EMAIL_SENDED_RECENTLY') {
        toastMessage = 'Email was sent recently please wait 1 minute and try again';
      } else if (res.message === 'please check your email') {
        toastMessage = 'Another link was sent to your email';
      }

      setToastState({
        open: true,
        type: ToastStateEnum.INFO,
        content: toastMessage,
      });
    },
  });
};

export default useResetToken;
