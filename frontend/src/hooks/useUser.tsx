import { AxiosError } from 'axios';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';

import { resetUserPassword } from '@/api/authService';
import { deleteUserRequest, updateUserIsAdminRequest } from '@/api/userService';
import {
  DeleteUser,
  InfiniteUsersWithTeams,
  NewPassword,
  ResetPasswordResponse,
  UseUserType,
} from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { InfiniteData, useMutation } from '@tanstack/react-query';

import useUserUtils from './useUserUtils';

const useUser = (): UseUserType => {
  const { setToastState, queryClient } = useUserUtils();

  const resetPassword = useMutation<ResetPasswordResponse, AxiosError, NewPassword>(
    (data: NewPassword) => resetUserPassword(data),
    {
      mutationKey: ['resetPassword'],
      onSuccess: async (response: ResetPasswordResponse) => response.message,
    },
  );

  const loginAzure = async () => {
    signIn<RedirectableProviderType>('azure-ad', {
      callbackUrl: DASHBOARD_ROUTE,
      redirect: true,
    });
  };

  const updateUserIsAdmin = useMutation(updateUserIsAdminRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['usersWithTeams']);

      // // updates the usersList recoil
      // const users = usersWithTeamsList.map((user) =>
      //   user.user._id === data._id ? { ...user, isAdmin: data.isSAdmin } : user,
      // );

      // setUsersWithTeamsList(users);

      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error while updating the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });

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
    loginAzure,
    resetPassword,
    updateUserIsAdmin,
    deleteUser,
  };
};

export default useUser;
