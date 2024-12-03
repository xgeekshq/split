import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getAllUsers } from '@/api/userService';
import { USERS_KEY } from '@/constants/react-query/keys';
import { createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/users-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useUsers = () => {
  const setToastState = useSetRecoilState(toastState);

  const fetchAllUsers = useQuery({
    queryKey: [USERS_KEY],
    queryFn: () => getAllUsers(),
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleErrorOnFetchAllUsers = () => {
    setToastState(createSuccessMessage(ErrorMessages.GET));
  };

  return {
    fetchAllUsers,
    handleErrorOnFetchAllUsers,
  };
};

export default useUsers;
