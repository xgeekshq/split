import { zodResolver } from '@hookform/resolvers/zod';
import { DragDropContext, DropResult } from '@react-forked/dnd';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import Select from 'react-select';
import { useSetRecoilState } from 'recoil';
import { io, Socket } from 'socket.io-client';

import { getBoardRequest } from '../../api/boardService';
import Column from '../../components/Board/Column/Column';
import BoardHeader from '../../components/Board/Header';
import Icon from '../../components/icons/Icon';
import SpinnerPage from '../../components/loadings/LoadingPage';
import AlertBox from '../../components/Primitives/AlertBox';
import AlertCustomDialog from '../../components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from '../../components/Primitives/AlertDialog';
import Button from '../../components/Primitives/Button';
import Flex from '../../components/Primitives/Flex';
import Input from '../../components/Primitives/Input';
import { Switch, SwitchThumb } from '../../components/Primitives/Switch';
import Text from '../../components/Primitives/Text';
import { countBoardCards } from '../../helper/board/countCards';
import useBoard from '../../hooks/useBoard';
import useCards from '../../hooks/useCards';
import SchemaCreateBoard from '../../schema/schemaCreateBoardForm';
import { styled } from '../../stitches.config';
import { boardInfoState } from '../../store/board/atoms/board.atom';
import { Container } from '../../styles/pages/boards/board.styles';
import MergeCardsDto from '../../types/board/mergeCard.dto';
import UpdateCardPositionDto from '../../types/card/updateCardPosition.dto';
import { NEXT_PUBLIC_BACKEND_URL } from '../../utils/constants';

interface OptionType {
	value: string;
	label: string;
}

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

interface BoardProps {
	boardId: string;
	mainBoardId?: string;
}

//--------------------------

const Overlay = styled('div', {
	position: 'absolute',
	inset: '0',
	background: 'rgba(80, 80, 89, 0.2) ',
	backdropFilter: 'blur(3px)',
	width: '100%',
	height: '100vh'
});

const Content = styled('div', {
	position: 'absolute',
	backgroundColor: '$white',
	width: '592px',
	height: '100vh',
	right: '0'
});

//-------------------------

const Board: React.FC<BoardProps> = ({ boardId, mainBoardId }) => {
	/// ////
	const DEFAULT_MAX_VOTES = '6';
	const methods = useForm({
		mode: 'onBlur',
		reValidateMode: 'onBlur',

		resolver: zodResolver(SchemaCreateBoard)
	});

	const handleLimitVotesChange = (checked: boolean) => {
		if (checked) {
			setValue('maxVotes', DEFAULT_MAX_VOTES);
			register('maxVotes');
		}
		if (!checked) {
			unregister('maxVotes');
			clearErrors('maxVotes');
		}
	};

	/// ///
	Board.defaultProps = {
		mainBoardId: undefined
	};
	const { data: session } = useSession({ required: true });
	const [open, setOpen] = useState(true);

	const queryClient = useQueryClient();
	const userId = session?.user?.id;

	const socketClient = useRef<Socket>();
	const socketId = socketClient?.current?.id;

	const { updateCardPosition, mergeCards, mergeBoard } = useCards();
	const [filter, setFilter] = useState('order');

	const { fetchBoard } = useBoard({
		autoFetchBoard: true
	});
	const { data } = fetchBoard;
	const board = data?.board;

	// Set Recoil Atom
	const setBoard = useSetRecoilState(boardInfoState);

	useEffect(() => {
		if (data) {
			setBoard(data);
		}
	}, [data, setBoard]);

	const isResponsible = board?.users.find(
		(boardUser) => boardUser.role === 'responsible' && boardUser.user._id === userId
	);

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
	const filteredColumns = () => {
		if (filter === 'order') return board?.columns;
		return board?.columns.map((column) => {
			return {
				...column,
				cards: column.cards.sort((a, b) => {
					const votesA = a.items.length === 1 ? a.items[0].votes.length : a.votes.length;
					const votesB = b.items.length === 1 ? b.items[0].votes.length : b.votes.length;
					return votesB - votesA;
				})
			};
		});
	};

	if (board && userId && socketId && filteredColumns) {
		return (
			<>
				<BoardHeader />
				<Container>
					<Flex css={{ width: '100%', px: '$36' }} direction="column">
						<Flex>
							<Select
								value={{
									value: filter,
									label: `${filter.charAt(0).toUpperCase()}${filter.substring(1)}`
								}}
								options={[
									{ value: 'order', label: 'Order' },
									{ value: 'votes', label: 'Votes' }
								]}
								onChange={(option) => setFilter((option as OptionType)?.value)}
							/>
							<Button
								onClick={() => setOpen(true)}
								variant="primaryOutline"
								css={{ margin: '0 0 0 auto' }}
							>
								<Icon name="settings" />
								Board settings
								<Icon name="arrow-down" />
							</Button>
							{console.log('open=', open)}
						</Flex>
						{board.submitedByUser && board.submitedAt && (
							<AlertBox
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
						{board.isSubBoard && !board.submitedByUser && isResponsible && (
							<AlertCustomDialog
								css={{ left: '37% !important' }}
								defaultOpen={false}
								title="Merge board into main board"
								text="If you merge your sub-teams’ board into the main board it can not be edited anymore afterwards. Are you sure you want to merge it?"
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
											my: '$20',
											width: '206px'
										}}
									>
										Merge into main board
									</Button>
								</AlertDialogTrigger>
							</AlertCustomDialog>
						)}

						<Flex css={{ width: '100%', mt: '$32' }} gap="24">
							<DragDropContext onDragEnd={onDragEnd}>
								{filteredColumns()?.map((column, index) => {
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
											anonymous={board.postAnonymously}
											isMainboard={!board.isSubBoard}
											boardUser={board.users.find(
												(userFound) =>
													(userFound.user._id as unknown as string) ===
													userId
											)}
											maxVotes={Number(board.maxVotes)}
											countAllCards={countAllCards}
											isSubmited={!!board.submitedByUser}
											filter={filter}
										/>
									);
								})}
							</DragDropContext>
						</Flex>
						{open && (
							<Overlay>
								<Content>
									<FormProvider {...methods}>
										<Flex direction="column">
											<Flex
												css={{
													borderBottom: '1px solid $colors$primary100'
												}}
											>
												<Text
													heading="4"
													css={{
														padding: '24px 32px'
													}}
												>
													Board Settings{' '}
												</Text>
												<Icon
													name="close"
													css={{
														margin: '24px 32px 0 auto',
														// margin: '24px 0 0 auto',
														// padding: '24px 32px',
														width: '24px',
														height: '24px',
														color: '$primary'
													}}
												/>
											</Flex>
											<Text heading="4" css={{ padding: '24px 32px' }}>
												{' '}
												Board Name{' '}
											</Text>

											<Text heading="4" css={{ padding: '0 32px' }}>
												{' '}
												Board Settings{' '}
											</Text>
											<Text heading="5" css={{ padding: '18px 32px' }}>
												{' '}
												Configurations{' '}
												<Icon
													name="arrow-up"
													css={{
														width: '24px',
														height: '24px',
														color: '$primary'
													}}
												/>
											</Text>
											<Flex direction="column" css={{ padding: '25px 32px' }}>
												<Flex gap="20">
													<Switch
														css={{
															flex: '0 0 35px',
															width: '35px',
															height: '20px'
														}}
													>
														<SwitchThumb
															css={{
																width: '17.5px',
																height: '17.5px'
															}}
														>
															<Icon
																name="check"
																css={{
																	width: '10px',
																	height: '10px',
																	color: '$successBase'
																}}
															/>
														</SwitchThumb>
													</Switch>
													<Flex direction="column">
														<Text size="md" weight="medium">
															Hide votes from others
														</Text>
														<Text size="sm" color="primary500">
															Participants can not see the votes from
															other participants of this
															retrospective.
														</Text>
													</Flex>
												</Flex>
												<Flex gap="20">
													<Switch
														css={{
															flex: '0 0 35px ',
															width: '35px',
															height: '20px'
														}}
													>
														<SwitchThumb
															css={{
																width: '17.5px',
																height: '17.5px'
															}}
														>
															<Icon
																name="check"
																css={{
																	width: '10px',
																	height: '10px',
																	color: '$successBase'
																}}
															/>
														</SwitchThumb>
													</Switch>
													<Flex direction="column">
														<Text size="md" weight="medium">
															Option to post cards anonymously
														</Text>
														<Text
															size="sm"
															color="primary500"
															// maxWidth="400px"
														>
															Participants can decide to post cards
															anonymously or publicly (Name on card is
															disabled/enabled.)
														</Text>
													</Flex>
												</Flex>
												<Flex gap="20">
													<Switch
														checked={!!board.maxVotes}
														onCheckedChange={handleLimitVotesChange}
														css={{
															flex: '0 0 35px ',
															width: '35px',
															height: '20px'
														}}
													>
														<SwitchThumb
															css={{
																width: '17.5px',
																height: '17.5px'
															}}
														>
															{!!board.maxVotes && (
																<Icon
																	name="check"
																	css={{
																		width: '$10',
																		height: '$10',
																		color: '$successBase'
																	}}
																/>
															)}
														</SwitchThumb>
													</Switch>
													<Flex direction="column">
														<Text size="md" weight="medium">
															Limit votes
														</Text>
														<Text size="sm" color="primary500">
															Make votes more significant by limiting
															them.
														</Text>
														<Input
															css={{ mt: '$8' }}
															id="maxVotes"
															// disabled={!board.maxVotes}
															type="number"
															placeholder="Max votes"
														/>
													</Flex>
												</Flex>
											</Flex>
										</Flex>
										<Flex
											justify="end"
											css={{
												borderTop: '1px solid $colors$primary100',
												py: '$24',
												position: 'absolute',
												width: '100%',
												bottom: 0,
												right: 0
											}}
										>
											<Button
												onClick={() => setOpen(false)}
												variant="primaryOutline"
												css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
											>
												Cancel
											</Button>
											<Button
												onClick={() => setOpen(false)}
												variant="primary"
												css={{ marginRight: '$32', padding: '$16 $24' }}
											>
												Save
											</Button>
										</Flex>
									</FormProvider>
								</Content>
							</Overlay>
						)}
					</Flex>
				</Container>
			</>
		);
	}
	return <SpinnerPage />;
};

export default Board;
