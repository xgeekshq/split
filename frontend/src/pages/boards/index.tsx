import { ReactElement, Suspense } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';

import { getBoardsRequest } from 'api/boardService';
import MyBoards from 'components/Boards/MyBoards';
import QueryError from 'components/Errors/QueryError';
import requireAuthentication from 'components/HOC/requireAuthentication';
import Layout from 'components/layouts/Layout';
import LoadingPage from 'components/loadings/LoadingPage';
import Flex from 'components/Primitives/Flex';

const Boards = () => {
	const { data: session } = useSession({ required: true });

	if (!session) return null;
	return (
		<Flex direction="column">
			<Suspense fallback={<LoadingPage />}>
				<QueryError>
					<MyBoards userId={session.user.id} isSuperAdmin={session.isSAdmin} />
				</QueryError>
			</Suspense>
		</Flex>
	);
};

export default Boards;

Boards.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async (context: GetServerSidePropsContext) => {
		const queryClient = new QueryClient();
		await queryClient.prefetchInfiniteQuery('boards', ({ pageParam = 0 }) =>
			getBoardsRequest(pageParam, context)
		);
		return {
			props: {
				dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
			}
		};
	}
);
