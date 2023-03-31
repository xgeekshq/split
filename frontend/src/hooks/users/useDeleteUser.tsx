import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserRequest } from '@/api/userService';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { InfiniteUsersWithTeams } from '@/types/user/user';

import { USERS_KEY } from '.';
import { TEAMS_KEY } from '../teams';

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
            page: oldData.pages.map((page) => ({
              ...page,
              userWithTeams: page.userWithTeams.filter((value) => value.user._id !== userId),
            })),
          };
        },
      );
    },
    onSuccess: () => {
      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      queryClient.invalidateQueries([USERS_KEY, TEAMS_KEY]);

      setToastState({
        open: true,
        content: 'Error while updating the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useDeleteUser;
