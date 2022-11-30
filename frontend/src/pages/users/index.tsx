import { ReactElement, Suspense, useEffect } from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import UsersList from '@/components/Users/UsersList';
import { getAllUsersWithTeams } from '../../api/userService';
import requireAuthentication from '../../components/HOC/requireAuthentication';
import { toastState } from '../../store/toast/atom/toast.atom';
import { usersWithTeamsState } from '../../store/user/atoms/user.atom';
import { ToastStateEnum } from '../../utils/enums/toast-types';

const Users = () => {
  const { data: session } = useSession({ required: true });
  const setToastState = useSetRecoilState(toastState);
  const setUsersWithTeamsState = useSetRecoilState(usersWithTeamsState);

  const { data, isFetching } = useQuery(['usersWithTeams'], () => getAllUsersWithTeams(), {
    enabled: true,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setUsersWithTeamsState(data);
  }, [data, setUsersWithTeamsState]);

  if (!session || !data) return null;

  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <UsersList isFetching={isFetching} usersWithTeams={data} />
        </QueryError>
      </Suspense>
    </Flex>
  );
};

Users.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Users;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('usersWithTeams', () => getAllUsersWithTeams(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);
