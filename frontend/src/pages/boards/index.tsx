import { ReactElement, Suspense, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import MyBoards from '@/components/Boards/MyBoards';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import useTeam from '@/hooks/useTeam';
import { teamsListState, userTeamsListState } from '@/store/team/atom/team.atom';
import { useSetRecoilState } from 'recoil';
import { dehydrate, QueryClient } from 'react-query';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';

const Boards = () => {
  const { data: session } = useSession({ required: true });
  const setUserTeamsList = useSetRecoilState(userTeamsListState);
  const setAllTeamsList = useSetRecoilState(teamsListState);

  const {
    fetchTeamsOfUser: { data },
    fetchAllTeams: { data: dataAllTeams },
  } = useTeam();

  useEffect(() => {
    if (data) {
      setUserTeamsList(data);
    }
  }, [data, setUserTeamsList]);

  useEffect(() => {
    if (dataAllTeams) {
      setAllTeamsList(dataAllTeams);
    }
  }, [dataAllTeams, setAllTeamsList]);

  if (!session) return null;
  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <MyBoards isSuperAdmin={session.user.isSAdmin} userId={session.user.id} />
        </QueryError>
      </Suspense>
    </Flex>
  );
};

export default Boards;

Boards.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(undefined, context));
    await queryClient.prefetchQuery('allTeams', () => getAllTeams(context));
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);
