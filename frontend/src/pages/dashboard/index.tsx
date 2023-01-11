import React, { ReactElement, Suspense } from 'react';
import { useQuery } from 'react-query';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { InnerContainer } from '@/styles/pages/dashboard.styles';
import { getDashboardHeaderInfo } from '@/api/authService';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Text from '@/components/Primitives/Text';
import Tiles from '@/components/Dashboard/Tiles';
import RecentRetros from '@/components/Dashboard/RecentRetros';

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => ({
  props: {},
}));

const Dashboard = () => {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery('dashboardInfo', () => getDashboardHeaderInfo(), {
    enabled: true,
    refetchOnWindowFocus: false,
  });
  if (!isLoading && !data) return null;
  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <InnerContainer direction="column">
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
    </InnerContainer>
  );
};
export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
