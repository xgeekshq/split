import { updateUserIsAdminRequest } from '@/api/userService';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import { InfiniteUsersWithTeams } from '@/types/user/user';
import { USERS_KEY } from '.';
import { TEAMS_KEY } from '../teams';

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation(updateUserIsAdminRequest, {
    onMutate: ({ _id: userId, isSAdmin }) => {
      queryClient.setQueryData(
        [USERS_KEY, TEAMS_KEY],
        (oldData: InfiniteData<InfiniteUsersWithTeams> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              userWithTeams: page.userWithTeams.map((user) => {
                if (user.user._id !== userId) return user;

                const newUser = { ...user };
                newUser.user.isSAdmin = isSAdmin;
                return { ...newUser };
              }),
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

export default useUpdateUser;
