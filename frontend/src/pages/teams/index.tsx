import { ReactElement, Suspense } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';

import { getDashboardHeaderInfo } from 'api/authService';
import { getAllTeams } from 'api/teamService';
import QueryError from 'components/Errors/QueryError';
import Layout from 'components/layouts/Layout';
import LoadingPage from 'components/loadings/LoadingPage';
import Flex from 'components/Primitives/Flex';
import MyTeams from 'components/Teams/MyTeams';

const Teams = () => {
	const { data: session } = useSession({ required: true });

	if (!session) return null;
	return (
		<Flex direction="column">
			<Suspense fallback={<LoadingPage />}>
				<QueryError>
					<MyTeams userId={session.user.id} />
				</QueryError>
			</Suspense>
		</Flex>
	);
};

Teams.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getSession(context);
	if (session) {
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery('teams', () => getAllTeams(context));
		await queryClient.prefetchQuery('dashboardInfo', () => getDashboardHeaderInfo(context));

		return {
			props: {
				dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
			}
		};
	}
	return { props: {} };
};

export default Teams;
