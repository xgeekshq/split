import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { updateUserIsAdminRequest } from '@/api/userService';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/users-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { InfiniteUsersWithTeams } from '@/types/user/user';
import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';

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
      setToastState(createSuccessMessage(SuccessMessages.UPDATE));
    },
    onError: () => {
      queryClient.invalidateQueries([USERS_KEY, TEAMS_KEY]);
      setToastState(createErrorMessage(ErrorMessages.UPDATE));
    },
  });
};

export default useUpdateUser;
