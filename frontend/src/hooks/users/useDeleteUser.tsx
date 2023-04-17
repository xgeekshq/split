import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { deleteUserRequest } from '@/api/userService';
import { toastState } from '@/store/toast/atom/toast.atom';
import { InfiniteUsersWithTeams } from '@/types/user/user';
import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(deleteUserRequest, {
    onMutate: ({ id: userId }) => {
      queryClient.setQueryData(
        [USERS_KEY, TEAMS_KEY],
        (oldData: InfiniteData<InfiniteUsersWithTeams> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              userWithTeams: page.userWithTeams.filter((user) => user.user._id !== userId),
            })),
          };
        },
      );
    },
    onSuccess: () => {
      setToastState({
        open: true,
        content: 'The user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      queryClient.invalidateQueries([USERS_KEY, TEAMS_KEY]);

      setToastState({
        open: true,
        content: 'Error while deleting the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useDeleteUser;
