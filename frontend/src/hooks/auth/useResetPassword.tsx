import { useMutation } from '@tanstack/react-query';

import { resetUserPassword } from '@/api/authService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { USERS_KEY } from '@/utils/constants/reactQueryKeys';

const useResetPassword = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation([USERS_KEY, 'resetPassword'], resetUserPassword, {
    onSuccess: () => {
      setToastState({
        open: true,
        type: ToastStateEnum.SUCCESS,
        content: 'Password updated successfully',
      });
    },
    onError: () => {
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: 'Something went wrong, please try again.',
      });
    },
  });
};

export default useResetPassword;
