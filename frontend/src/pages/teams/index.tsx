import { ReactElement, Suspense } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import useTeam, { fetchTeamsFn, TEAMS_KEY } from '@/hooks/useTeam';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import TeamsList from '@/components/Teams/TeamsList/TeamList';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';
import { ROUTES } from '@/utils/routes';
import ScrollableContent from '@/components/Primitives/Layout/ScrollableContent/ScrollableContent';

const Teams = () => {
  const {
    fetchTeams: { data: teamsList, isLoading },
  } = useTeam({ enableFetchTeams: true });

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
            {isLoading ? (
              <Flex justify="center" css={{ mt: '$16' }}>
                <Dots />
              </Flex>
            ) : (
              <TeamsList teams={teamsList!} />
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
    const isSAdmin = session?.user.isSAdmin ?? false;

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery([TEAMS_KEY], () => fetchTeamsFn(isSAdmin));

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default Teams;
