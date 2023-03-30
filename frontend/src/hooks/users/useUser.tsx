import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/api/userService';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { USERS_KEY } from '.';

const useUser = (userId: string) => {
  const setToastState = useSetRecoilState(toastState);

  return useQuery([USERS_KEY, userId], () => getUser(userId), {
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUser;
