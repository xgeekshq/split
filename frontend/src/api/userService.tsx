import { GetServerSidePropsContext } from 'next';

import fetchData from '@/utils/fetchData';
import { User, UserWithTeams } from '../types/user/user';

export const getAllUsers = (context?: GetServerSidePropsContext): Promise<User[]> =>
  fetchData(`/users`, { context, serverSide: !!context });

export const getAllUsersWithTeams = (
  context?: GetServerSidePropsContext,
): Promise<UserWithTeams[]> => fetchData(`/users/teams`, { context, serverSide: !!context });
