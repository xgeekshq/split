import { ReactElement, Suspense, useEffect } from 'react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import UsersEdit from '@/components/Users/User/UserTeamsList';
import UserHeader from '@/components/Users/User/Header/Header';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getTeamsOfUser } from '@/api/teamService';
import { useSetRecoilState } from 'recoil';
import { userTeamsListState } from '@/store/team/atom/team.atom';
import useTeam from '@/hooks/useTeam';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/router';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import { ROUTES } from '@/utils/routes';

// TODO:
// - Remove the AutoFetch

const UserDetails = () => {
  const { replace } = useRouter();

  // Recoil States
  const setTeamsListState = useSetRecoilState(userTeamsListState);

  // Hooks
  const {
    fetchTeamsOfSpecificUser: { data, isFetching: fetchingTeams },
  } = useTeam({ autoFetchTeamsOfSpecificUser: true });

  const {
    getUserById: { data: user },
  } = useUser({ autoFetchGetUser: true });

  useEffect(() => {
    if (!data) {
      return;
    }

    setTeamsListState(data);
  }, [data, setTeamsListState]);

  if (!data || !user) {
    replace(ROUTES.Users);
    return null;
  }

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <UserHeader user={user} />
      <Flex
        css={{ height: '100%', position: 'relative', overflowY: 'auto', pr: '$8' }}
        direction="column"
      >
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {fetchingTeams ? (
              <Flex justify="center" css={{ mt: '$16' }}>
                <Dots />
              </Flex>
            ) : (
              <UsersEdit isLoading={fetchingTeams} />
            )}
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

UserDetails.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const userId = String(context.query.userId);

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(['teams', userId], () => getTeamsOfUser(userId, context));

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default UserDetails;
