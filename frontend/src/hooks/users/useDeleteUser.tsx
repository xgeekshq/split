import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { deleteUserRequest } from '@/api/userService';
import { TEAMS_KEY, USERS_KEY } from '@/constants/react-query/keys';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/users-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { InfiniteUsersWithTeams } from '@/types/user/user';

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const setToastState = useSetRecoilState(toastState);

  return useMutation({
    mutationFn: deleteUserRequest,
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
      setToastState(createSuccessMessage(SuccessMessages.DELETE));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY, TEAMS_KEY] });
      setToastState(createErrorMessage(ErrorMessages.DELETE));
    },
  });
};

export default useDeleteUser;
