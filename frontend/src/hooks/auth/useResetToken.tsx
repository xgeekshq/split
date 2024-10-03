import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { resetTokenEmail } from '@/api/authService';
import { USERS_KEY } from '@/constants/react-query/keys';
import { createInfoMessage } from '@/constants/toasts';
import { InfoMessages } from '@/constants/toasts/auth-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useResetToken = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation({
    mutationKey: [USERS_KEY, 'forgotPassword'],
    mutationFn: resetTokenEmail,
    onSuccess: (res) => {
      setToastState(createInfoMessage(InfoMessages.RESET_TOKEN(res.message)));
    },
  });
};

export default useResetToken;
