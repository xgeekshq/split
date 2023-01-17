import { ReactElement, Suspense, useEffect } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';

import { getDashboardHeaderInfo } from '@/api/authService';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import useTeam from '@/hooks/useTeam';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { useRecoilState } from 'recoil';
import { teamsListState } from '@/store/team/atom/team.atom';
import TeamsList from '@/components/Teams/TeamsList';

const Teams = () => {
  const { data: session } = useSession({ required: true });
  const userIsSAdmin = session?.user.isSAdmin;
  const [teamsList, setTeamsList] = useRecoilState(teamsListState);

  const {
    fetchTeamsOfUser: { data, isFetching },
    fetchAllTeams: { data: sAdminData, isFetching: adminIsFetching },
  } = useTeam();

  useEffect(() => {
    if (userIsSAdmin && sAdminData) setTeamsList(sAdminData);
    else if (!userIsSAdmin && data) setTeamsList(data);
  }, [data, sAdminData, setTeamsList, userIsSAdmin]);

  if (!session || !sAdminData) return null;

  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <TeamsList
            isFetching={userIsSAdmin ? adminIsFetching : isFetching}
            teams={teamsList}
            userId={session.user.id}
          />
        </QueryError>
      </Suspense>
    </Flex>
  );
};

Teams.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(['allTeams'], () => getAllTeams(context));
    await queryClient.prefetchQuery(['teams'], () => getTeamsOfUser(undefined, context));
    await queryClient.prefetchQuery(['dashboardInfo'], () => getDashboardHeaderInfo(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default Teams;
