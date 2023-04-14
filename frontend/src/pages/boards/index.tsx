import { ReactElement, Suspense } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import MyBoards from '@/components/Boards/MyBoards';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout/Layout';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import useCurrentSession from '@/hooks/useCurrentSession';
import { TEAMS_KEY } from '@/utils/constants/reactQueryKeys';
import { ROUTES } from '@/utils/routes';

const Boards = () => {
  const { session, userId, isSAdmin } = useCurrentSession({ required: true });

  if (!session) return null;

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
            <MyBoards isSuperAdmin={isSAdmin} userId={userId} />
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
