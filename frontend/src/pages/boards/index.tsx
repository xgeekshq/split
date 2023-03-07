import { ReactElement, Suspense, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import MyBoards from '@/components/Boards/MyBoards';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page';
import Flex from '@/components/Primitives/Flex';
import useTeam from '@/hooks/useTeam';
import { teamsListState } from '@/store/team/atom/team.atom';
import { useSetRecoilState } from 'recoil';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import MainPageHeader from '@/components/layouts/Layout/partials/MainPageHeader';
import { ROUTES } from '@/utils/routes';

const Boards = () => {
  const { data: session } = useSession({ required: true });
  const setTeamsList = useSetRecoilState(teamsListState);

  const {
    fetchUserBasedTeams: { data },
  } = useTeam();

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

    const queryClient = new QueryClient();

    if (session?.user.isSAdmin) {
      await queryClient.prefetchQuery(['userBasedTeams'], () => getAllTeams(context));
    } else {
      await queryClient.prefetchQuery(['userBasedTeams'], () => getTeamsOfUser(undefined, context));
    }

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);
