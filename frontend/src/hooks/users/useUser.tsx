import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getUser } from '@/api/userService';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/users-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { USERS_KEY } from '@/utils/constants/reactQueryKeys';

const useUser = (userId: string) => {
  const setToastState = useSetRecoilState(toastState);

  return useQuery([USERS_KEY, userId], () => getUser(userId), {
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.GET_ONE));
    },
  });
};

export default useUser;
