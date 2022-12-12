import { ReactElement, Suspense, useEffect } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';

import { getDashboardHeaderInfo } from '@/api/authService';
import { getTeamsOfUser } from '@/api/teamService';
import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import TeamsList from '@/components/Teams/TeamsList';
import useTeam from '@/hooks/useTeam';
import useTeamUtils from '@/hooks/useTeamUtils';
import requireAuthentication from '@/components/HOC/requireAuthentication';

const Teams = () => {
  const { data: session } = useSession({ required: true });
  const { teamsList, setTeamsList } = useTeamUtils();

  const {
    fetchTeamsOfUser: { data, isFetching },
  } = useTeam({ autoFetchTeam: false });

  useEffect(() => {
    if (data) {
      setTeamsList(data);
    }
  }, [data, setTeamsList]);

  if (!session || !data) return null;

  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <TeamsList isFetching={isFetching} teams={teamsList} userId={session.user.id} />
        </QueryError>
      </Suspense>
    </Flex>
  );
};

Teams.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(context));
    await queryClient.prefetchQuery('dashboardInfo', () => getDashboardHeaderInfo(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default Teams;
