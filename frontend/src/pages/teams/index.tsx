import { ReactElement, Suspense, useEffect } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';

import { getDashboardHeaderInfo } from '@/api/authService';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page';
import Flex from '@/components/Primitives/Flex';
import useTeam from '@/hooks/useTeam';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { useRecoilState } from 'recoil';
import { teamsListState } from '@/store/team/atom/team.atom';
import TeamsList from '@/components/Teams/TeamsList';
import Dots from '@/components/Primitives/Loading/Dots';
import MainPageHeader from '@/components/layouts/Layout/partials/MainPageHeader';
import { ROUTES } from '@/utils/routes';

const Teams = () => {
  const { data: session } = useSession({ required: true });
  const [teamsList, setTeamsList] = useRecoilState(teamsListState);

  const {
    fetchUserBasedTeams: { data, isFetching },
  } = useTeam();

  useEffect(() => {
    if (data) setTeamsList(data);
  }, [data, setTeamsList]);

  if (!session || !data) return null;

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <MainPageHeader
        title="Teams"
        button={{
          link: ROUTES.NewTeam,
          label: 'Create new team',
        }}
      />
      <Flex
        direction="column"
        css={{
          height: '100%',
          position: 'relative',
          overflowY: 'auto',
          pr: '$8',
        }}
      >
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {isFetching ? (
              <Flex justify="center" css={{ mt: '$16' }}>
                <Dots />
              </Flex>
            ) : (
              <TeamsList teams={teamsList} />
            )}
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

Teams.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

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

    await queryClient.prefetchQuery(['dashboardInfo'], () => getDashboardHeaderInfo(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default Teams;
