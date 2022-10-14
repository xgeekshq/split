import { getDashboardHeaderInfo } from 'api/authService';
import { getAllTeams } from 'api/teamService';
import MyBoards from 'components/Boards/MyBoards';
import QueryError from 'components/Errors/QueryError';
import requireAuthentication from 'components/HOC/requireAuthentication';
import Layout from 'components/layouts/Layout';
import LoadingPage from 'components/loadings/LoadingPage';
import Flex from 'components/Primitives/Flex';
import MyTeams from 'components/Teams/MyTeams';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { lazy, ReactElement, Suspense } from 'react';
import { dehydrate, QueryClient } from 'react-query';

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

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async (context: GetServerSidePropsContext) => {
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery(['teams'], () => {
			getAllTeams(context);
		});
		return {
			props: {
				dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
			}
		};
	}
);

export default Teams;

Teams.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
