import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { NEXT_PUBLIC_ENABLE_AZURE } from '@/constants';
import { createErrorMessage } from '@/constants/toasts';
import { toastState } from '@/store/toast/atom/toast.atom';
import { checkUserExists, checkUserExistsAD } from '@api/authService';

type EmailNameType = {
  email: string;
  goback: boolean;
};

type UseSignUpCallback = {
  onSuccess: (data: boolean | 'az' | 'local') => void;
  onError: (error: Error) => void;
};

const useSignUp = (emailName: EmailNameType, { onSuccess, onError }: UseSignUpCallback) => {
  const setToastState = useSetRecoilState(toastState);

  return useQuery(
    ['checkUserExists', emailName.email],
    () =>
      NEXT_PUBLIC_ENABLE_AZURE
        ? checkUserExistsAD(emailName.email)
        : checkUserExists(emailName.email),
    {
      enabled: !!emailName.email && !emailName.goback,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess,
      onError: (error: Error) => {
        onError(error);
        setToastState(createErrorMessage('Connection error, please try again!'));
      },
    },
  );
};

export default useSignUp;
