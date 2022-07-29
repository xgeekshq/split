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
import BoardType from 'types/board/board';
import MergeCardsDto from 'types/board/mergeCard.dto';
import UpdateCardPositionDto from 'types/card/updateCardPosition.dto';
import { NEXT_PUBLIC_BACKEND_URL } from 'utils/constants';
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

type DragDropAreaProps = {
	userId: string;
	board: BoardType;
	socketId: any;
};
const DragDropArea: React.FC<DragDropAreaProps> = ({ userId, board, socketId }) => {
	const { updateCardPosition, mergeCards } = useCards();

	const countAllCards = useMemo(() => {
		return board.columns ? countBoardCards(board.columns) : 0;
	}, [board]);

	const onDragEnd = ({ destination, source, combine, draggableId }: DropResult) => {
		if (!source || (!combine && !destination) || !board?._id || !socketId) {
			return;
		}
		const { droppableId: sourceDroppableId, index: sourceIndex } = source;

		if (combine && userId) {
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

		if (!combine && destination) {
			const { droppableId: destinationDroppableId, index: destinationIndex } = destination;

			if (destinationDroppableId === sourceDroppableId && destinationIndex === sourceIndex) {
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

	return (
		<Flex css={{ width: '100%', backgroundColor: 'Yellow' }} gap="24">
			<DragDropContext onDragEnd={onDragEnd}>
				{board.columns.map((column, index) => {
					return (
						<Column
							key={column._id}
							cards={column.cards}
							columnId={column._id}
							index={index}
							userId={userId}
							boardId={board._id}
							title={column.title}
							color={column.color}
							socketId={socketId}
							hideCards={board.hideCards}
							isMainboard={!board.isSubBoard}
							boardUser={board.users.find(
								(boardUser) => boardUser.user._id === userId
							)}
							maxVotes={Number(board.maxVotes)}
							countAllCards={countAllCards}
							isSubmited={!!board.submitedByUser}
						/>
					);
				})}
			</DragDropContext>
		</Flex>
	);
};

type MergeIntoMainButtonProps = {
	boardId: string;
};
const MergeIntoMainButton: React.FC<MergeIntoMainButtonProps> = ({ boardId }) => {
	const { mergeBoard } = useCards();

	return (
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
	);
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
	// const { data } = fetchBoard;

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
		return !!(!board?.isSubBoard ? board : mainBoard)?.team.users.find(
			(boardUser) =>
				[TeamUserRoles.STAKEHOLDER, TeamUserRoles.ADMIN].includes(boardUser.role) &&
				boardUser.user._id === userId
		);
	}, [board, mainBoard, userId]);
	const [isResponsible, isOwner] = useMemo(() => {
		return board
			? [
					!!board.users.find(
						(boardUser) =>
							boardUser.role === BoardUserRoles.RESPONSIBLE &&
							boardUser.user._id === userId
					),
					board.createdBy._id === userId
			  ]
			: [false, false];
	}, [board, userId]);

	// Only the conditions below are allowed to edit the board settings:
	const boardSettingsCondition =
		isStakeholderOrAdmin || (board?.isSubBoard && isResponsible) || isOwner || isSAdmin;

	// Socket IO
	const queryClient = useQueryClient();
	const socketClient = useRef<Socket>();
	const socketId = socketClient?.current?.id;
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
			if (socketClient.current) {
				socketClient.current.close();
			}
			socketClient.current = undefined;
		},
		[]
	);

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
				<Flex
					justify="between"
					align="center"
					css={{ py: '$32', width: '100%', backgroundColor: 'Blue' }}
					gap={40}
				>
					{/* TODO check !board.submitedByUser ? */}
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

					{boardSettingsCondition ? (
						<BoardSettings isOpen={isOpen} setIsOpen={setIsOpen} socketId={socketId} />
					) : null}

					{/* TODO check !board.submitedByUser ? */}
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
