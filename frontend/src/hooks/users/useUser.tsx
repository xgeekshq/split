import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getUser } from '@/api/userService';
import { USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/users-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useUser = (userId: string) => {
  const setToastState = useSetRecoilState(toastState);

  const fetchUser = useQuery({
    queryKey: [USERS_KEY, userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleOnErrorFetchUser = () => {
    setToastState(createErrorMessage(ErrorMessages.GET_ONE));
  };

  return {
    fetchUser,
    handleOnErrorFetchUser,
  };
};

export default useUser;
