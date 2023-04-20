import React from 'react';
import { BeforeCapture, DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Column from '@/components/Board/Column/Column';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { createInfoMessage } from '@/constants/toasts';
import { countBoardCards } from '@/helper/board/countCards';
import useBoard from '@/hooks/useBoard';
import useCards from '@/hooks/useCards';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { filteredColumnsState } from '@/store/board/atoms/filterColumns';
import { onDragCardStart } from '@/store/card/atoms/card.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { styled } from '@/styles/stitches/stitches.config';
import BoardType from '@/types/board/board';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';
import ColumnType from '@/types/column';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

const Container = styled(Flex, {
  boxSizing: 'border-box',
  marginBottom: '$32',
  overflowY: 'scroll',
  width: '100%',
  position: 'relative',
  '@media (max-width: 1350px)': {
    overflowY: 'auto',
    minHeight: '62vh',
  },
  '@media (min-height: 800px)': {
    minHeight: '75vh',
  },
});

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
  // Hooks to mutate cards/column
  const { updateCardPosition, mergeCards } = useCards();
  const {
    updateBoard: { mutate: mutateBoard },
  } = useBoard({ autoFetchBoard: false });

  // Recoil States
  const setToastState = useSetRecoilState(toastState);
  const setOnDragCard = useSetRecoilState(onDragCardStart);
  const filteredColumns = useRecoilValue(filteredColumnsState);

  const [boardState, setBoardState] = useRecoilState(boardInfoState);

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
      setToastState(createInfoMessage('The merge is not possible. The cards are hidden.'));
    }
  };

  const handleSubmitDragColumnType = (
    columnsArray: ColumnType[],
    sourceIndex: number,
    destinationIndex: number,
    column: ColumnType,
  ) => {
    columnsArray.splice(sourceIndex, 1);
    columnsArray.splice(destinationIndex, 0, column);

    setBoardState({
      board: {
        ...boardState.board,
        columns: columnsArray,
      },
    });

    mutateBoard({
      ...boardState.board,
      createdBy: boardState.board.createdBy._id,
      team: boardState.board.team ? boardState.board.team.id : undefined,
      columns: columnsArray,
      responsible: boardState.board.users?.find((user) => user.role === BoardUserRoles.RESPONSIBLE),
      socketId,
      mainBoardId: boardState.mainBoard?._id,
    });
  };

  const handleSubmitDragCardType = (changes: UpdateCardPositionDto) => {
    updateCardPosition.mutate(changes);
    setOnDragCard('');
  };

  const onDragEnd = ({ destination, source, combine, draggableId, type }: DropResult) => {
    if (!source || (!combine && !destination) || !board?._id || !socketId) {
      return;
    }

    const { droppableId: sourceDroppableId, index: sourceIndex } = source;

    if (destination) {
      const { droppableId: destinationDroppableId, index: destinationIndex } = destination;

      if (destinationDroppableId === sourceDroppableId && destinationIndex === sourceIndex) {
        return;
      }

      if (type === 'COLUMN') {
        const column = board.columns.find((col) => col._id === draggableId);

        if (!column) {
          return;
        }

        handleSubmitDragColumnType([...board.columns], sourceIndex, destinationIndex, column);

        return;
      }

      if (type === 'CARD' && !combine) {
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

        handleSubmitDragCardType(changes);
      }
    }

    if (type === 'CARD') {
      if (!combine && !destination) {
        return;
      }

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
    }
  };

  const isMainboard = !board.isSubBoard && board.dividedBoards.length > 0;
  const hasMoreThanThreeColumns = !!(board.columns.length > 3);

  const ColumnnContainer = (
    <Droppable
      direction="horizontal"
      droppableId="column"
      isDropDisabled={isMainboard || !hasAdminRole}
      type="COLUMN"
    >
      {(provided) => (
        <Container
          ref={provided.innerRef}
          css={{
            gap: '$24',
          }}
          {...provided.droppableProps}
        >
          {board.columns.map((column, index) => (
            <Column
              key={column._id}
              addCards={board.addCards}
              boardId={board._id}
              boardUser={board.users.find((boardUser) => boardUser.user?._id === userId)}
              cardText={column.cardText}
              cards={column.cards}
              color={column.color}
              columnId={column._id}
              columnIndex={index}
              countAllCards={countAllCards}
              hasAdminRole={hasAdminRole}
              hasMoreThanThreeColumns={hasMoreThanThreeColumns}
              hideCards={board.hideCards}
              index={index}
              isDefaultText={column.isDefaultText}
              isMainboard={isMainboard}
              isRegularBoard={isRegularBoard}
              isSubBoard={board.isSubBoard}
              isSubmited={!!board.submitedByUser}
              maxVotes={Number(board.maxVotes)}
              phase={board.phase}
              postAnonymously={board.postAnonymously}
              socketId={socketId}
              title={column.title}
              userId={userId}
            />
          ))}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );

  return (
    <>
      <DragDropContext onBeforeCapture={onDragStart} onDragEnd={onDragEnd}>
        {ColumnnContainer}
      </DragDropContext>
    </>
  );
};

export default DragDropArea;
