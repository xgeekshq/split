import { GetServerSidePropsContext } from 'next';

import fetchData from '@/utils/fetchData';
import { User } from '../types/user/user';

export const getAllUsers = (context?: GetServerSidePropsContext): Promise<User[]> =>
  fetchData(`/users`, { context, serverSide: !!context });
