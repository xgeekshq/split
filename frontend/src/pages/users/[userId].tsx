import { ReactElement, Suspense } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { getTeamsWithoutUser, getUserTeams } from '@/api/teamService';
import { getUser } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout/Layout';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import TeamsList from '@/components/Teams/TeamsList/TeamList';
import UserHeader from '@/components/Users/User/UserHeader/UserHeader';
import useUserTeams from '@/hooks/teams/useUserTeams';
import useUser from '@/hooks/users/useUser';
import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';
import { ROUTES } from '@/utils/routes';

const UserDetails = () => {
  const {
    replace,
    query: { userId },
  } = useRouter();

  // Hooks
  const { data: userData, isLoading: isLoadingUser } = useUser(userId as string);
  const { data: userTeams, isLoading: isLoadingTeams } = useUserTeams(userId as string);

  if (!userData || !userTeams) {
    replace(ROUTES.Users);
    return null;
  }

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <UserHeader user={userData} />
      <Flex
        css={{ height: '100%', position: 'relative', overflowY: 'auto', pr: '$8' }}
        direction="column"
      >
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {isLoadingUser || isLoadingTeams ? (
              <Flex css={{ mt: '$16' }} justify="center">
                <Dots />
              </Flex>
            ) : (
              <TeamsList teams={userTeams} />
            )}
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

UserDetails.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (context) => {
  const userId = String(context.query.userId);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery([USERS_KEY, userId], () => getUser(userId, context)),
    queryClient.prefetchQuery([TEAMS_KEY, USERS_KEY, userId], () => getUserTeams(userId, context)),
    queryClient.prefetchQuery([TEAMS_KEY, 'not', USERS_KEY, userId], () =>
      getTeamsWithoutUser(userId, context),
    ),
  ]);

  return {
    props: {
      key: userId,
      dehydratedState: dehydrate(queryClient),
    },
  };
});

export default UserDetails;
