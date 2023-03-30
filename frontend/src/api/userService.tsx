import { GetServerSidePropsContext } from 'next';

import fetchData from '@/utils/fetchData';
import { User, UpdateUserIsAdmin, DeleteUser, InfiniteUsersWithTeams } from '../types/user/user';

// #region GET
export const getAllUsers = (context?: GetServerSidePropsContext): Promise<User[]> =>
  fetchData(`/users`, { context, serverSide: !!context });

export const getAllUsersWithTeams = (
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

export const getUser = (userId?: string, context?: GetServerSidePropsContext): Promise<User> =>
  fetchData(`/users/${userId}`, { context, serverSide: !!context });

export const deleteUserRequest = (user: DeleteUser): Promise<Boolean> =>
  fetchData(`/users/${user.id}`, { method: 'DELETE' });
