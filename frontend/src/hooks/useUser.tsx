import { deleteUserRequest } from '@/api/userService';
import { DeleteUser, InfiniteUsersWithTeams, UseUserType } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { InfiniteData, useMutation } from '@tanstack/react-query';

import useUserUtils from './useUserUtils';

const useUser = (): UseUserType => {
  const { setToastState, queryClient } = useUserUtils();

  const deleteUser = useMutation(deleteUserRequest, {
    onMutate: (variables: DeleteUser) => {
      queryClient.setQueryData<InfiniteData<InfiniteUsersWithTeams>>(
        ['usersWithTeams'],
        (oldData: InfiniteData<InfiniteUsersWithTeams> | undefined) => {
          if (!oldData) return { pages: [], pageParams: [] };
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              userWithTeams: page.userWithTeams.filter((value) => value.user._id !== variables.id),
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
      queryClient.invalidateQueries(['usersWithTeams']);
      setToastState({
        open: true,
        content: 'Error while deleting the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    deleteUser,
  };
};

export default useUser;
