import React from 'react';
import { useSetRecoilState } from 'recoil';
import { DragDropContext, DropResult } from '@react-forked/dnd';

import Column from 'components/Board/Column/Column';
import Flex from 'components/Primitives/Flex';
import { countBoardCards } from 'helper/board/countCards';
import useCards from 'hooks/useCards';
import { toastState } from 'store/toast/atom/toast.atom';
import BoardType from 'types/board/board';
import MergeCardsDto from 'types/board/mergeCard.dto';
import UpdateCardPositionDto from 'types/card/updateCardPosition.dto';
import { ToastStateEnum } from 'utils/enums/toast-types';

type Props = {
	userId: string;
	board: BoardType;
	socketId: string;
};
const DragDropArea: React.FC<Props> = ({ userId, board, socketId }) => {
	const { updateCardPosition, mergeCards } = useCards();
	const setToastState = useSetRecoilState(toastState);

	const countAllCards = React.useMemo(() => {
		return board.columns ? countBoardCards(board.columns) : 0;
	}, [board]);

	const handleCombine = (
		combineDroppableId: string,
		combineDraggableId: string,
		sourceDroppableId: string,
		draggableId: string,
		sourceIndex: number
	) => {
		if (!board.hideCards) {
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
		} else if (board.hideCards) {
			setToastState({
				open: true,
				type: ToastStateEnum.INFO,
				content: 'The merge is not possible. The cards are hidden'
			});
		}
	};

	const onDragEnd = ({ destination, source, combine, draggableId }: DropResult) => {
		if (!source || (!combine && !destination) || !board?._id || !socketId) {
			return;
		}
		const { droppableId: sourceDroppableId, index: sourceIndex } = source;

		if (combine && userId) {
			const { droppableId: combineDroppableId, draggableId: combineDraggableId } = combine;

			handleCombine(
				combineDroppableId,
				combineDraggableId,
				sourceDroppableId,
				draggableId,
				sourceIndex
			);
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
		<Flex css={{ width: '100%' }} gap="24">
			<DragDropContext onDragEnd={onDragEnd}>
				{board.columns.map((column, index) => {
					return (
						<Column
							key={column._id}
							boardId={board._id}
							cards={column.cards}
							color={column.color}
							columnId={column._id}
							countAllCards={countAllCards}
							hideCards={board.hideCards}
							index={index}
							isMainboard={!board.isSubBoard}
							isSubmited={!!board.submitedByUser}
							maxVotes={Number(board.maxVotes)}
							socketId={socketId}
							title={column.title}
							userId={userId}
							boardUser={board.users.find(
								(boardUser) => boardUser.user._id === userId
							)}
						/>
					);
				})}
			</DragDropContext>
		</Flex>
	);
};

export default DragDropArea;
