import { ReactElement, Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Flex from '@/components/Primitives/Flex';
import UsersEdit from '@/components/Users/UserEdit';
import { ContentSection } from '@/components/layouts/Layout/styles';
import UserHeader from '@/components/Users/UserEdit/partials/UserHeader';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getTeamsOfUser } from '@/api/teamService';
import { useSetRecoilState } from 'recoil';
import { userTeamsListState } from '@/store/team/atom/team.atom';
import useTeam from '@/hooks/useTeam';
import useUser from '@/hooks/useUser';
import MainPageHeader from '@/components/layouts/Layout/partials/MainPageHeader';

const UserDetails = () => {
  const { data: session } = useSession({ required: true });

  // Recoil States
  const setTeamsListState = useSetRecoilState(userTeamsListState);

  const {
    fetchTeamsOfSpecificUser: { data, isFetching },
  } = useTeam({
    autoFetchTeamsOfSpecificUser: true,
  });

  const {
    getUserById: { data: user },
  } = useUser({ autoFetchGetUser: true });

  useEffect(() => {
    if (!data) {
      return;
    }

    setTeamsListState(data);
  }, [data, setTeamsListState]);

  if (!session || !data || !user) return null;

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <MainPageHeader title="Users" />
      <Flex direction="column">
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            <ContentSection gap="36" justify="between">
              <Flex css={{ width: '100%' }} direction="column">
                <Flex justify="between">
                  <UserHeader
                    firstName={user.firstName}
                    lastName={user.lastName}
                    isSAdmin={user.isSAdmin}
                    providerAccountCreatedAt={user.providerAccountCreatedAt}
                    joinedAt={user.joinedAt}
                  />
                </Flex>
                {data && <UsersEdit isLoading={isFetching} />}
              </Flex>
            </ContentSection>
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

UserDetails.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const userId = context.query.userId?.toString();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(['teams', userId], () => getTeamsOfUser(userId, context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default UserDetails;
