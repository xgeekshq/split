import { ReactElement, Suspense } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';

import { getDashboardHeaderInfo } from '@/api/authService';
import { getTeamsOfUser } from '@/api/teamService';
import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import TeamsList from '@/components/Teams/TeamsList';
import useTeam from '@/hooks/useTeam';

const Teams = () => {
  const { data: session } = useSession({ required: true });

  const {
    fetchTeamsOfUser: { data, isFetching },
  } = useTeam({ autoFetchTeam: false });

  if (!session || !data) return null;
  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <TeamsList isFetching={isFetching} teams={data} userId={session.user.id} />
        </QueryError>
      </Suspense>
    </Flex>
  );
};

Teams.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession(context);
  if (session) {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(context));
    await queryClient.prefetchQuery('dashboardInfo', () => getDashboardHeaderInfo(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  }
  return { props: {} };
};

export default Teams;
