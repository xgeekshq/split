import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getAllUsers } from '@/api/userService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { USERS_KEY } from '@/utils/constants/reactQueryKeys';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const useUsers = () => {
  const setToastState = useSetRecoilState(toastState);

  return useQuery([USERS_KEY], () => getAllUsers(), {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useUsers;
