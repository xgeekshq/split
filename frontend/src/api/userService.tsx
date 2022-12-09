import { GetServerSidePropsContext } from 'next';

import fetchData from '@/utils/fetchData';
import { User, UserWithTeams, UpdateUserIsAdmin, DeleteUser } from '../types/user/user';

export const getAllUsers = (context?: GetServerSidePropsContext): Promise<User[]> =>
  fetchData(`/users`, { context, serverSide: !!context });

export const getAllUsersWithTeams = (
  context?: GetServerSidePropsContext,
): Promise<UserWithTeams[]> => fetchData(`/users/teams`, { context, serverSide: !!context });

export const updateUserIsAdminRequest = (user: UpdateUserIsAdmin): Promise<User> =>
  fetchData(`/users/sadmin/`, { method: 'PUT', data: user });

export const deleteUserRequest = (user: DeleteUser): Promise<Boolean> =>
  fetchData(`/users/${user.id}`, { method: 'DELETE' });
