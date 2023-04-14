import { GetServerSidePropsContext } from 'next';

import { DeleteUser, InfiniteUsersWithTeams, UpdateUserIsAdmin, User } from '@/types/user/user';
import fetchData from '@/utils/fetchData';

// #region GET
export const getAllUsers = (context?: GetServerSidePropsContext): Promise<User[]> =>
  fetchData(`/users`, { context, serverSide: !!context });

export const getUser = (userId: string, context?: GetServerSidePropsContext): Promise<User> =>
  fetchData(`/users/${userId}`, { context, serverSide: !!context });

export const getUsersWithTeams = (
  pageParam: number,
  searchUser?: string,
  context?: GetServerSidePropsContext,
): Promise<InfiniteUsersWithTeams> =>
  fetchData(`/users/teams?page=${pageParam ?? 0}&searchUser=${searchUser ?? ''}`, {
    context,
    serverSide: !!context,
  });
// #endregion

export const updateUserIsAdminRequest = (user: UpdateUserIsAdmin): Promise<User> =>
  fetchData(`/users/sadmin/`, { method: 'PUT', data: user });

export const deleteUserRequest = (user: DeleteUser): Promise<boolean> =>
  fetchData(`/users/${user.id}`, { method: 'DELETE' });
