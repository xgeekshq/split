import { ReactElement, Suspense, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';

import { StyledTextTab } from 'styles/pages/boards/index.styles';

import { getBoardsRequest } from 'api/boardService';
import MyBoards from 'components/Boards/MyBoards';
import QueryError from 'components/Errors/QueryError';
import requireAuthentication from 'components/HOC/requireAuthentication';
import Layout from 'components/layouts/Layout';
import LoadingPage from 'components/loadings/LoadingPage';
import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';

const Boards = () => {
	const [currentTab, setCurrentTab] = useState('boards');
	const { data: session } = useSession({ required: true });

	const handleSetBoardsPage = () => {
		setCurrentTab('boards');
	};

	if (!session) return null;
	return (
		<Flex direction="column" css={{ mt: '$18' }}>
			<Flex gap="32">
				<StyledTextTab
					data-activetab={currentTab === 'boards'}
					size="md"
					color="primary300"
					onClick={handleSetBoardsPage}
				>
					My boards
				</StyledTextTab>
				<StyledTextTab
					css={{ '@hover': { '&:hover': { cursor: 'default' } } }}
					data-activetab={currentTab === 'upcoming'}
					size="md"
					color="primary300"
					// to be used in full version -> onClick={() => setCurrentTab("upcoming")}
				>
					Upcoming
				</StyledTextTab>
			</Flex>
			<Separator css={{ position: 'relative', top: '-1px', zIndex: '-1' }} />
			{currentTab === 'boards' && (
				<Suspense fallback={<LoadingPage />}>
					<QueryError>
						<MyBoards userId={session.user.id} isSuperAdmin={session.isSAdmin} />
					</QueryError>
				</Suspense>
			)}
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
