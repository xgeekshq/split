import React, { useEffect, useMemo, useRef, useState } from 'react';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { DragDropContext, DropResult } from '@react-forked/dnd';
import { io, Socket } from 'socket.io-client';

import { Container } from 'styles/pages/boards/board.styles';

import { getBoardRequest } from 'api/boardService';
import Column from 'components/Board/Column/Column';
import BoardHeader from 'components/Board/Header';
import { BoardSettings } from 'components/Board/Settings';
import LoadingPage from 'components/loadings/LoadingPage';
import AlertBox from 'components/Primitives/AlertBox';
import AlertCustomDialog from 'components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from 'components/Primitives/AlertDialog';
import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import { countBoardCards } from 'helper/board/countCards';
import useBoard from 'hooks/useBoard';
import useCards from 'hooks/useCards';
import { boardInfoState, newBoardState } from 'store/board/atoms/board.atom';
import { updateBoardDataState } from 'store/updateBoard/atoms/update-board.atom';
import MergeCardsDto from 'types/board/mergeCard.dto';
import UpdateCardPositionDto from 'types/card/updateCardPosition.dto';
import { NEXT_PUBLIC_BACKEND_URL } from 'utils/constants';
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

	const queryClient = useQueryClient();

	/**
	 * Session
	 */
	const { data: session } = useSession({ required: true });
	const userId = session?.user?.id;
	const isSAdmin = session?.isSAdmin;

	const socketClient = useRef<Socket>();
	const socketId = socketClient?.current?.id;

	const { updateCardPosition, mergeCards, mergeBoard } = useCards();

	const { fetchBoard } = useBoard({
		autoFetchBoard: true
	});
	const { data } = fetchBoard;

	const mainBoard = data?.mainBoardData;
	const board = data?.board;

	const [newBoard, setNewBoard] = useRecoilState(newBoardState);

	useEffect(() => {
		if (board?._id === newBoard?._id || mainBoard?._id === newBoard?._id) {
			setNewBoard(undefined);
		}
	}, [newBoard, board, mainBoard, setNewBoard]);

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
				board: { _id, title, maxVotes, hideVotes, postAnonymously, hideCards, users }
			} = data;
			setUpdateBoard({
				board: {
					_id,
					title,
					maxVotes,
					hideCards,
					hideVotes,
					postAnonymously,
					users
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	/**
	 * Board Settings permissions
	 */
	const isStakeholderOrAdmin = !board?.isSubBoard
		? board?.team.users.find(
				(user) => ['stakeholder', 'admin'].includes(user.role) && user.user._id === userId
		  )
		: mainBoard?.team.users.find(
				(user) => ['stakeholder', 'admin'].includes(user.role) && user.user._id === userId
		  );

	const isResponsible = board?.users.find(
		(user) => user.role === 'responsible' && user.user._id === userId
	);

	const isOwner = board?.createdBy._id === userId;

	/**
	 * Only the conditions below are allowed to edit the board settings:
	 * - Is admin or a stakeholder
	 * - Is responsible (if is a sub-board)
	 * - If the user is the owner
	 */
	const BOARD_SETTINGS_CONDITION =
		isStakeholderOrAdmin || (board?.isSubBoard && isResponsible) || isOwner || isSAdmin;

	const countAllCards = useMemo(() => {
		if (board?.columns) return countBoardCards(board?.columns);
		return 0;
	}, [board?.columns]);

	useEffect(() => {
		const newSocket: Socket = io(NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:3200', {
			transports: ['polling']
		});

		newSocket.on('connect', () => {
			newSocket.emit('join', { boardId });
		});

		newSocket.on('updateAllBoard', () => {
			queryClient.invalidateQueries(['board', { id: boardId }]);
		});
		socketClient.current = newSocket;
	}, [boardId, queryClient]);

	useEffect(
		() => () => {
			if (socketClient.current) socketClient.current?.close();
			socketClient.current = undefined;
		},
		[]
	);

	const onDragEnd = (result: DropResult) => {
		const { destination, source, combine, draggableId } = result;

		if (!source) return;

		if (!combine && !destination) {
			return;
		}

		const { droppableId: sourceDroppableId, index: sourceIndex } = source;

		if (combine && userId && board?._id && socketId) {
			const { droppableId: combineDroppableId, draggableId: combineDraggableId } = combine;

			const changes: MergeCardsDto = {
				columnIdOfCard: sourceDroppableId,
				colIdOfCardGroup: combineDroppableId,
				cardId: draggableId,
				boardId: board._id,
				cardGroupId: combineDraggableId,
				socketId,
				userId,
				cardPosition: sourceIndex
			};

			mergeCards.mutate(changes);
		}

		if (!combine && destination && board?._id && socketId) {
			const { droppableId: destinationDroppableId, index: destinationIndex } = destination;

			if (
				!combine &&
				destinationDroppableId === sourceDroppableId &&
				destinationIndex === sourceIndex
			) {
				return;
			}
			const changes: UpdateCardPositionDto = {
				colIdOfCard: source.droppableId,
				targetColumnId: destinationDroppableId,
				newPosition: destinationIndex,
				cardPosition: sourceIndex,
				cardId: draggableId,
				boardId: board?._id,
				socketId
			};
			updateCardPosition.mutate(changes);
		}
	};
	/**
	 * Confirm if any sub-board is merged or not
	 */
	const haveSubBoardsMerged =
		!board?.isSubBoard &&
		board?.dividedBoards &&
		board?.dividedBoards?.filter((dividedBoard) => !isEmpty(dividedBoard.submitedAt)).length ===
			0;

	if (board && userId && socketId) {
		return (
			<>
				<BoardHeader />
				<Container>
					<Flex css={{ width: '100%', px: '$36' }} direction="column">
						<Flex justify="between" align="center" css={{ py: '$32' }} gap={40}>
							{board.isSubBoard && !board.submitedByUser && isResponsible && (
								<AlertCustomDialog
									defaultOpen={false}
									title="Merge board into main board"
									text="If you merge your sub-team's board into the main board it can not be edited anymore afterwards. Are you sure you want to merge it?"
									cancelText="Cancel"
									confirmText="Merge into main board"
									handleConfirm={() => {
										mergeBoard.mutate(boardId);
									}}
									variant="primary"
								>
									<AlertDialogTrigger asChild>
										<Button
											variant="primaryOutline"
											size="sm"
											css={{
												fontWeight: '$medium',
												width: '$206'
											}}
										>
											Merge into main board
										</Button>
									</AlertDialogTrigger>
								</AlertCustomDialog>
							)}
							{haveSubBoardsMerged && (
								<AlertBox
									css={{ flex: 1 }}
									type="info"
									title="No sub-team has merged into this main board yet."
								/>
							)}

							{BOARD_SETTINGS_CONDITION && (
								<BoardSettings
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									socketId={socketId}
									isStakeholderOrAdmin={isStakeholderOrAdmin?.user._id === userId}
									isOwner={isOwner}
									isSAdmin={isSAdmin}
								/>
							)}
							{board.submitedByUser && board.submitedAt && (
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
							)}
						</Flex>

						<Flex css={{ width: '100%' }} gap="24">
							<DragDropContext onDragEnd={onDragEnd}>
								{board.columns.map((column, index) => {
									return (
										<Column
											key={column._id}
											cards={column.cards}
											columnId={column._id}
											index={index}
											userId={userId}
											boardId={boardId}
											title={column.title}
											color={column.color}
											socketId={socketId}
											hideCards={board.hideCards}
											isMainboard={!board.isSubBoard}
											boardUser={board.users.find(
												(userFound) =>
													(userFound.user._id as unknown as string) ===
													userId
											)}
											maxVotes={Number(board.maxVotes)}
											countAllCards={countAllCards}
											isSubmited={!!board.submitedByUser}
										/>
									);
								})}
							</DragDropContext>
						</Flex>
					</Flex>
				</Container>
			</>
		);
	}
	return <LoadingPage />;
};

Board.defaultProps = {
	mainBoardId: undefined
};

export default Board;
