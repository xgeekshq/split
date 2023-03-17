import { ReactElement, Suspense, useEffect } from 'react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import UsersList from '@/components/Users/UsersList';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAllUsersWithTeams } from '@/api/userService';
import { useRecoilState } from 'recoil';
import { usersWithTeamsState } from '@/store/user/atoms/user.atom';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import useUser from '@/hooks/useUser';

const Users = () => {
  const [usersList, setUsersList] = useRecoilState(usersWithTeamsState);

  const {
    fetchUsersWithTeams: { data, isFetching },
  } = useUser();

  useEffect(() => {
    if (data && data.pages) {
      const users = data.pages.flatMap((page) => page.userWithTeams);
      setUsersList(users);
    }
  }, []);

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <MainPageHeader title="Users" />
      <Flex direction="column">
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {isFetching ? (
              <Flex justify="center" css={{ mt: '$16' }}>
                <Dots />
              </Flex>
            ) : (
              <UsersList users={usersList} />
            )}
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

Users.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery(
      ['usersWithTeams'],
      ({ pageParam = 0 }) => getAllUsersWithTeams(pageParam, '', context),
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
