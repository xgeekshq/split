import React, { useEffect, useMemo, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { Container } from 'styles/pages/boards/board.styles';

import { getBoardRequest } from 'api/boardService';
import DragDropArea from 'components/Board/DragDropArea';
import BoardHeader from 'components/Board/Header';
import MergeIntoMainButton from 'components/Board/MergeIntoMainButton';
import { BoardSettings } from 'components/Board/Settings';
import LoadingPage from 'components/loadings/LoadingPage';
import AlertBox from 'components/Primitives/AlertBox';
import Button from 'components/Primitives/Button';
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
	const isSAdmin = session?.isSAdmin;

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

	// Only the conditions below are allowed to edit the board settings:
	const isUserAllowedToEditBoardSettings =
		isStakeholderOrAdmin || (board?.isSubBoard && isResponsible) || isOwner || isSAdmin;

	// Socket IO
	const [socketId, cleanSocket] = useSocketIO(boardId);
	useEffect(() => cleanSocket, [cleanSocket]);

	// Confirm if any sub-board is merged or not
	const haveSubBoardsMerged =
		!board?.isSubBoard &&
		board?.dividedBoards &&
		board?.dividedBoards?.filter((dividedBoard) => !isEmpty(dividedBoard.submitedAt)).length ===
			0;

	return board && userId && socketId ? (
		<>
			<BoardHeader />
			<Container direction="column">
				<Flex justify="between" align="center" css={{ py: '$32', width: '100%' }} gap={40}>
					{board.isSubBoard && !board.submitedByUser && isResponsible ? (
						<MergeIntoMainButton boardId={boardId} />
					) : null}

					{haveSubBoardsMerged ? (
						<AlertBox
							css={{ flex: 1 }}
							type="info"
							title="No sub-team has merged into this main board yet."
						/>
					) : null}

					{isUserAllowedToEditBoardSettings ? (
						<BoardSettings isOpen={isOpen} setIsOpen={setIsOpen} socketId={socketId} />
					) : null}

					{board.submitedByUser && board.submitedAt ? (
						<AlertBox
							css={{ flex: '1' }}
							type="info"
							title={`Sub-team board successfully merged into main board ${new Date(
								board.submitedAt
							).toLocaleDateString()}, ${new Date(
								board.submitedAt
							).toLocaleTimeString()}`}
							text="The sub-team board can not be edited anymore. If you want to edit cards, go to the main board and edit the according card there."
						>
							<Link
								key={mainBoardId}
								href={{
									pathname: `[boardId]`,
									query: { boardId: mainBoardId }
								}}
							>
								<Button size="sm">Go to main board</Button>
							</Link>
						</AlertBox>
					) : null}
				</Flex>

				<DragDropArea userId={userId} board={board} socketId={socketId} />
			</Container>
		</>
	) : (
		<LoadingPage />
	);
};

export default Board;
