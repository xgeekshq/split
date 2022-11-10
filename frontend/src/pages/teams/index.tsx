import { ReactElement, Suspense } from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';

import { getDashboardHeaderInfo } from 'api/authService';
import { getTeamsOfUser } from 'api/teamService';
import QueryError from 'components/Errors/QueryError';
import Layout from 'components/layouts/Layout';
import LoadingPage from 'components/loadings/LoadingPage';
import Flex from 'components/Primitives/Flex';
import MyTeams from 'components/Teams/MyTeams';
import { toastState } from '../../store/toast/atom/toast.atom';
import { ToastStateEnum } from '../../utils/enums/toast-types';

const Teams = () => {
	const { data: session } = useSession({ required: true });

	const setToastState = useSetRecoilState(toastState);

	const { data, isFetching } = useQuery(['teams'], () => getTeamsOfUser(), {
		enabled: true,
		refetchOnWindowFocus: false,
		onError: () => {
			setToastState({
				open: true,
				content: 'Error getting the teams',
				type: ToastStateEnum.ERROR
			});
		}
	});

	if (!session || !data) return null;
	return (
		<Flex direction="column">
			<Suspense fallback={<LoadingPage />}>
				<QueryError>
					<MyTeams isFetching={isFetching} teams={data} userId={session.user.id} />
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
		await queryClient.prefetchQuery('teams', () => getTeamsOfUser(context));
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
