import React, { ReactElement, Suspense } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

import { getDashboardHeaderInfo } from '@/api/authService';
import RecentRetros from '@/components/Dashboard/RecentRetros';
import Tiles from '@/components/Dashboard/Tiles/Tiles';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout/Layout';
import MainPageHeader from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/constants/routes';

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => ({
  props: {},
}));

const Dashboard = () => {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboardInfo'],
    queryFn: () => getDashboardHeaderInfo(),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data) return null;

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <MainPageHeader
        title={`Welcome, ${session?.user.firstName}`}
        button={{
          link: ROUTES.NewBoard,
          label: 'Add new board',
        }}
      />
      <Flex css={{ mt: '$40' }} direction="column">
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            <Tiles data={data} />
          </QueryError>
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            <Text css={{ mt: '$64' }} heading="4">
              My recent retros
            </Text>
            <RecentRetros userId={session?.user.id as string} />
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};
export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
