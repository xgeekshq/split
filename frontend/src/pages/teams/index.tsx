import { ReactElement, Suspense } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout/Layout';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import ScrollableContent from '@/components/Primitives/Layout/ScrollableContent/ScrollableContent';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import TeamsList from '@/components/Teams/TeamsList/TeamList';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { ROUTES } from '@/constants/routes';
import useTeams from '@/hooks/teams/useTeams';
import useCurrentSession from '@/hooks/useCurrentSession';

const Teams = () => {
  const { isSAdmin } = useCurrentSession();
  const {
    fetchAllTeams: { data: teamsList, isLoading, isError },
    handleErrorOnFetchAllTeams,
  } = useTeams(isSAdmin);

  if (isError) {
    handleErrorOnFetchAllTeams();
  }

  console.log('ATAO', teamsList);

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <MainPageHeader
        title="Teams"
        button={{
          link: ROUTES.NewTeam,
          label: 'Create new team',
        }}
      />
      <ScrollableContent>
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {isLoading || !teamsList ? (
              <Flex css={{ mt: '$16' }} data-testid="loading" justify="center">
                <Dots />
              </Flex>
            ) : (
              <TeamsList teams={teamsList} />
            )}
          </QueryError>
        </Suspense>
      </ScrollableContent>
    </Flex>
  );
};

Teams.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    // CHECK: 'getServerSession' should be used instead of 'getSession'
    // https://next-auth.js.org/configuration/nextjs#unstable_getserversession
    const session = await getSession({ req: context.req });
    const userId = session?.user.id;
    const isSAdmin = session?.user.isSAdmin ?? false;

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
      queryKey: [TEAMS_KEY],
      queryFn: () => {
        if (isSAdmin) {
          return getAllTeams(context);
        }
        return getUserTeams(userId, context);
      },
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default Teams;
