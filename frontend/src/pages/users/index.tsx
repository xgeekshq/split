import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement, Suspense } from 'react';

import { getUsersWithTeams } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout/Layout';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import UsersList from '@/components/Users/UsersList/UsersList';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { USERS_KEY } from '@/hooks/users';
import { TEAMS_KEY } from '@/hooks/teams';

const Users = () => (
  <Flex css={{ width: '100%' }} direction="column" gap="16">
    <MainPageHeader title="Users" />
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <UsersList />
      </QueryError>
    </Suspense>
  </Flex>
);

Users.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery(
      [USERS_KEY, TEAMS_KEY],
      ({ pageParam = 0 }) => getUsersWithTeams(pageParam, '', context),
      {
        structuralSharing: (_, newData) => ({
          pageParams: [null],
          pages: newData.pages,
        }),
      },
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default Users;
