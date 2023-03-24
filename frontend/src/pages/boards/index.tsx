import { ReactElement, Suspense, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import MyBoards from '@/components/Boards/MyBoards';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { TEAMS_KEY, useTeams } from '@/hooks/useTeam';
import { teamsListState } from '@/store/team/atom/team.atom';
import { useSetRecoilState } from 'recoil';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';
import { ROUTES } from '@/utils/routes';
import { getAllTeams, getUserTeams } from '@/api/teamService';

const Boards = () => {
  const { data: session } = useSession({ required: true });
  const setTeamsList = useSetRecoilState(teamsListState);

  const { data } = useTeams(session?.user.isSAdmin ?? false);

  useEffect(() => {
    if (data) setTeamsList(data);
  }, [data, setTeamsList]);

  if (!session || !data) return null;

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <MainPageHeader
        title="Boards"
        button={{
          link: ROUTES.NewBoard,
          label: 'Add new board',
        }}
      />
      <Flex direction="column">
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            <MyBoards isSuperAdmin={session?.user.isSAdmin} userId={session?.user.id} />
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

export default Boards;

Boards.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    // CHECK: 'getServerSession' should be used instead of 'getSession'
    // https://next-auth.js.org/configuration/nextjs#unstable_getserversession
    const session = await getSession({ req: context.req });
    const userId = session?.user.id;
    const isSAdmin = session?.user.isSAdmin ?? false;

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery([TEAMS_KEY], () => {
      if (isSAdmin) {
        return getAllTeams(context);
      }
      return getUserTeams(userId, context);
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);
