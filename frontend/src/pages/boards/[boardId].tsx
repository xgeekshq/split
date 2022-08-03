import React, { useEffect, useMemo, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { Container } from 'styles/pages/boards/board.styles';

import { getBoardRequest } from 'api/boardService';
import AlertGoToMainBoard from 'components/Board/AlertGoToMainBoard';
import AlertMergeIntoMain from 'components/Board/AlertMergeIntoMain';
import DragDropArea from 'components/Board/DragDropArea';
import BoardHeader from 'components/Board/Header';
import { BoardSettings } from 'components/Board/Settings';
import LoadingPage from 'components/loadings/LoadingPage';
import AlertBox from 'components/Primitives/AlertBox';
import Flex from 'components/Primitives/Flex';
import useBoard from 'hooks/useBoard';
import { useSocketIO } from 'hooks/useSocketIO';
import { boardInfoState, newBoardState } from 'store/board/atoms/board.atom';
import { updateBoardDataState } from 'store/updateBoard/atoms/update-board.atom';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import { TeamUserRoles } from 'utils/enums/team.user.roles';
import isEmpty from 'utils/isEmpty';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { boardId } = context.query;
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['board', { id: boardId }], () =>
		getBoardRequest(boardId as string, context)
	);
	return {
		props: {
			key: context.query.boardId,
			dehydratedState: dehydrate(queryClient),
			mainBoardId: context.query.mainBoardId ?? null,
			boardId: context.query.boardId
		}
	};
};

type Props = {
	boardId: string;
	mainBoardId?: string;
};

const Board: NextPage<Props> = ({ boardId, mainBoardId }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = useSession({ required: true });
	const userId = session?.user?.id;

	const {
		fetchBoard: { data }
	} = useBoard({
		autoFetchBoard: true
	});
	const mainBoard = data?.mainBoardData;
	const board = data?.board;

	const [newBoard, setNewBoard] = useRecoilState(newBoardState);

	useEffect(() => {
		if (data?.board?._id === newBoard?._id) {
			setNewBoard(undefined);
		}
	}, [newBoard, data, setNewBoard]);

	// Set Recoil Atom
	const setBoard = useSetRecoilState(boardInfoState);
	const setUpdateBoard = useSetRecoilState(updateBoardDataState);
	useEffect(() => {
		if (data) {
			setBoard(data);
		}
	}, [data, setBoard]);

	useEffect(() => {
		if (data && isOpen) {
			const {
				board: { _id, title, maxVotes, hideVotes, postAnonymously, hideCards }
			} = data;

			setUpdateBoard({
				board: {
					_id,
					title,
					maxVotes,
					hideCards,
					hideVotes,
					postAnonymously
				}
			});
		}
	}, [data, isOpen, setUpdateBoard]);

	// Board Settings permissions
	const isStakeholderOrAdmin = useMemo(() => {
		return (!board?.isSubBoard ? board : mainBoard)?.team.users.some(
			(boardUser) =>
				[TeamUserRoles.STAKEHOLDER, TeamUserRoles.ADMIN].includes(boardUser.role) &&
				boardUser.user._id === userId
		);
	}, [board, mainBoard, userId]);
	const [isResponsible, isOwner] = useMemo(() => {
		return board
			? [
					board.users.some(
						(boardUser) =>
							boardUser.role === BoardUserRoles.RESPONSIBLE &&
							boardUser.user._id === userId
					),
					board.createdBy._id === userId
			  ]
			: [false, false];
	}, [board, userId]);

	// Socket IO
	const [socketId, cleanSocket] = useSocketIO(boardId);
	useEffect(() => cleanSocket, [cleanSocket]);

	// Show button in sub boards to merge into main
	const showButtonToMerge = !!(board?.isSubBoard && !board.submitedByUser && isResponsible);

	// Show board settings button if current user is allowed to edit
	const showBoardSettings =
		(isStakeholderOrAdmin ||
			(board?.isSubBoard && isResponsible) ||
			isOwner ||
			session?.isSAdmin) &&
		board?.submitedAt === null;

	// Show Alert message if any sub-board wansn't merged
	const showMessageHaveSubBoardsMerged =
		!board?.isSubBoard &&
		board?.dividedBoards &&
		board?.dividedBoards?.filter((dividedBoard) => !isEmpty(dividedBoard.submitedAt)).length ===
			0;

	// Show Alert message if sub board was merged
	const showMessageIfMerged = !!(board?.submitedByUser && board.submitedAt && mainBoardId);

	return board && userId && socketId ? (
		<>
			<BoardHeader />
			<Container direction="column">
				<Flex align="center" css={{ py: '$32', width: '100%' }} gap={40} justify="between">
					{showButtonToMerge ? <AlertMergeIntoMain boardId={boardId} /> : null}

					{showMessageHaveSubBoardsMerged ? (
						<AlertBox
							css={{ flex: 1 }}
							title="No sub-team has merged into this main board yet."
							type="info"
						/>
					) : null}

					{showBoardSettings ? (
						<BoardSettings isOpen={isOpen} setIsOpen={setIsOpen} socketId={socketId} />
					) : null}

					{showMessageIfMerged ? (
						<AlertGoToMainBoard
							mainBoardId={mainBoardId}
							submitedAt={board.submitedAt as Date}
						/>
					) : null}
				</Flex>

				<DragDropArea board={board} socketId={socketId} userId={userId} />
			</Container>
		</>
	) : (
		<LoadingPage />
	);
};

export default Board;
