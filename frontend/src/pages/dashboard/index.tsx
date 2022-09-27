import React, { lazy, ReactElement, Suspense } from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';

import { InnerContainer } from 'styles/pages/dashboard.styles';

import { getDashboardHeaderInfo } from 'api/authService';
import { getDashboardBoardsRequest } from 'api/boardService';
import QueryError from 'components/Errors/QueryError';
import requireAuthentication from 'components/HOC/requireAuthentication';
import Layout from 'components/layouts/Layout';
import LoadingPage from 'components/loadings/LoadingPage';
import Text from 'components/Primitives/Text';

const RecentRetros = lazy(() => import('components/Dashboard/RecentRetros'));
const Tiles = lazy(() => import('components/Dashboard/Tiles'));

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async (context: GetServerSidePropsContext) => {
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery('dashboardInfo', () => getDashboardHeaderInfo(context));
		await queryClient.prefetchInfiniteQuery('boards/dashboard', ({ pageParam = 0 }) =>
			getDashboardBoardsRequest(pageParam, context)
		);

		return {
			props: {
				dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
			}
		};
	}
);

const Dashboard = () => {
	const { data: session } = useSession({ required: true });

	const { data } = useQuery('dashboardInfo', () => getDashboardHeaderInfo(), {
		enabled: true,
		refetchOnWindowFocus: false
	});
	if (!session || !data) return null;
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
					<RecentRetros userId={session.user.id as string} />
				</QueryError>
			</Suspense>
		</InnerContainer>
	);
};
export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
