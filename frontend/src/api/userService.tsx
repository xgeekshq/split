import { GetServerSidePropsContext } from 'next';

import fetchData from 'utils/fetchData';
import { User } from '../types/user/user';

export const getAllUsers = (context?: GetServerSidePropsContext): Promise<User[]> => {
	return fetchData(`/users`, { context, serverSide: !!context });
};
