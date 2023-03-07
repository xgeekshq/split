import { useMutation, useQuery } from '@tanstack/react-query';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { AxiosError } from 'axios';

import { loginGuest, registerGuest, resetTokenEmail, resetUserPassword } from '@/api/authService';
import {
  EmailUser,
  NewPassword,
  ResetPasswordResponse,
  ResetTokenResponse,
  UseUserType,
} from '@/types/user/user';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { setCookie } from 'cookies-next';
import { GUEST_USER_COOKIE } from '@/utils/constants';
import {
  deleteUserRequest,
  getAllUsers,
  getUser,
  updateUserIsAdminRequest,
} from '@/api/userService';
import useUserUtils from './useUserUtils';

interface AutoFetchProps {
  autoFetchUsers?: boolean;
  autoFetchGetUser?: boolean;
}

const useUser = ({
  autoFetchUsers = false,
  autoFetchGetUser = false,
}: AutoFetchProps = {}): UseUserType => {
  const { setToastState, queryClient, userId, router } = useUserUtils();

  const registerGuestUser = useMutation(registerGuest, {
    onSuccess: (data, variables) => {
      setCookie(GUEST_USER_COOKIE, data);
      router.push({ pathname: `/boards/[boardId]`, query: { boardId: variables.board } });
    },
    onError: () => {
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: 'Error login guest user',
      });
    },
  });

  const loginGuestUser = useMutation(loginGuest, {
    onSuccess: (data) => {
      setCookie(GUEST_USER_COOKIE, data);
    },
    onError: () => {
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: 'Error login guest user',
      });
    },
  });

  const resetToken = useMutation<ResetTokenResponse, AxiosError, EmailUser>(
    (emailUser: EmailUser) => resetTokenEmail(emailUser),
    {
      mutationKey: ['forgotPassword'],
      onSuccess: async (response: ResetTokenResponse) => response.message,
    },
  );

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

  const fetchUsers = useQuery(['users'], () => getAllUsers(), {
    enabled: autoFetchUsers,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const getUserById = useQuery(['userById', userId], () => getUser(userId), {
    enabled: autoFetchGetUser,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries(['usersWithTeams']);

      setToastState({
        open: true,
        content: 'The team user was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error while deleting the user',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    loginAzure,
    resetToken,
    resetPassword,
    updateUserIsAdmin,
    deleteUser,
    fetchUsers,
    getUserById,
    registerGuestUser,
    loginGuestUser,
  };
};

export default useUser;
