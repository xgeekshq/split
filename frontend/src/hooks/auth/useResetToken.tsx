import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { resetTokenEmail } from '@/api/authService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ForgotPassword } from '@/utils/constants/forgotPassword';
import { USERS_KEY } from '@/utils/constants/reactQueryKeys';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const useResetToken = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation([USERS_KEY, 'forgotPassword'], resetTokenEmail, {
    onSuccess: (res) => {
      let toastMessage = '';

      if (res.message === ForgotPassword.SENT_RECENTLY) {
        toastMessage = 'Email was sent recently please wait 1 minute and try again';
      } else if (res.message === ForgotPassword.CHECK_EMAIL) {
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
