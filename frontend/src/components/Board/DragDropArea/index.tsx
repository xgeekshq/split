import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { DragDropContext, DropResult, BeforeCapture } from '@hello-pangea/dnd';
import Flex from '@/components/Primitives/Flex';
import { countBoardCards } from '@/helper/board/countCards';
import useCards from '@/hooks/useCards';
import { toastState } from '@/store/toast/atom/toast.atom';
import BoardType from '@/types/board/board';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { onDragCardStart } from '@/store/card/atoms/card.atom';
import { filteredColumnsState } from '@/store/board/atoms/filterColumns';
import Column from '@/components/Board/Column/Column';

type Props = {
  userId: string;
  board: BoardType;
  socketId: string;
  hasAdminRole: boolean;
  isRegularBoard?: boolean;
};

const DragDropArea: React.FC<Props> = ({
  userId,
  board,
  socketId,
  isRegularBoard,
  hasAdminRole,
}) => {
  const { updateCardPosition, mergeCards } = useCards();
  const setToastState = useSetRecoilState(toastState);
  const setOnDragCard = useSetRecoilState(onDragCardStart);
  const filteredColumns = useRecoilValue(filteredColumnsState);

  const countAllCards = React.useMemo(
    () => (board.columns ? countBoardCards(board.columns) : 0),
    [board],
  );

  const onDragStart = ({ draggableId }: BeforeCapture) => {
    setOnDragCard(draggableId);
  };

  const handleCombine = (
    combineDroppableId: string,
    combineDraggableId: string,
    sourceDroppableId: string,
    draggableId: string,
    sourceIndex: number,
    sorted: boolean,
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
        cardPosition: sourceIndex,
        sorted,
      };

      mergeCards.mutate(changes);
    } else if (board.hideCards) {
      setToastState({
        open: true,
        type: ToastStateEnum.INFO,
        content: 'The merge is not possible. The cards are hidden',
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
        sourceIndex,
        filteredColumns.includes(sourceDroppableId),
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
        socketId,
        sorted: filteredColumns.includes(source.droppableId),
      };

      updateCardPosition.mutate(changes);
      setOnDragCard('');
    }
  };

  return (
    <Flex css={{ width: '100%' }} gap="24">
      <DragDropContext onDragEnd={onDragEnd} onBeforeCapture={onDragStart}>
        {board.columns.map((column, index) => (
          <Column
            key={column._id}
            boardId={board._id}
            cards={column.cards}
            color={column.color}
            cardText={column.cardText}
            columnId={column._id}
            isDefaultText={column.isDefaultText}
            countAllCards={countAllCards}
            hideCards={board.hideCards}
            index={index}
            isMainboard={!board.isSubBoard && board.dividedBoards.length > 0}
            isSubmited={!!board.submitedByUser}
            maxVotes={Number(board.maxVotes)}
            socketId={socketId}
            title={column.title}
            userId={userId}
            boardUser={board.users.find((boardUser) => boardUser.user?._id === userId)}
            isRegularBoard={isRegularBoard}
            hasAdminRole={hasAdminRole}
            addCards={board.addCards}
            postAnonymously={board.postAnonymously}
          />
        ))}
      </DragDropContext>
    </Flex>
  );
};

export default DragDropArea;
