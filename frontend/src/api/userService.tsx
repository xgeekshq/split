import { GetServerSidePropsContext } from 'next';

import fetchData from '@/utils/fetchData';
import { User, UserWithTeams, UpdateUserIsAdmin } from '../types/user/user';

export const getAllUsers = (context?: GetServerSidePropsContext): Promise<User[]> =>
  fetchData(`/users`, { context, serverSide: !!context });

export const getAllUsersWithTeams = (
  context?: GetServerSidePropsContext,
): Promise<UserWithTeams[]> => fetchData(`/users/teams`, { context, serverSide: !!context });

export const updateUserIsAdminRequest = (user: UpdateUserIsAdmin): Promise<User> =>
  fetchData(`/users/sadmin/`, { method: 'PUT', data: user });

export const deleteUserRequest = ({ id }: { id: string }): Promise<Boolean> =>
  fetchData(`/users/${id}`, { method: 'DELETE' });
