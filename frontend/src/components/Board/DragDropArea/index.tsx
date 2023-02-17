import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { DragDropContext, DropResult, BeforeCapture, Droppable } from '@hello-pangea/dnd';
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
import { styled } from '@/styles/stitches/stitches.config';
import useBoard from '@/hooks/useBoard';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import ColumnType from '@/types/column';

const Container = styled(Flex, { maxHeight: '100vh', width: '100%', display: 'inline-flex' });

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
      setToastState({
        open: true,
        type: ToastStateEnum.INFO,
        content: 'The merge is not possible. The cards are hidden',
      });
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
      team: boardState.board.team ? boardState.board.team.id : undefined,
      columns: columnsArray,
      responsible: boardState.board.users?.find((user) => user.role === BoardUserRoles.RESPONSIBLE),
      socketId,
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

  const ColumnnContainer = (
    <Droppable
      droppableId="column"
      direction="horizontal"
      type="COLUMN"
      isDropDisabled={isMainboard || !hasAdminRole}
    >
      {(provided) => (
        <Container css={{ gap: '$24' }} ref={provided.innerRef} {...provided.droppableProps}>
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
              isMainboard={isMainboard}
              isSubBoard={board.isSubBoard}
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
              columnIndex={index}
            />
          ))}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd} onBeforeCapture={onDragStart}>
        {ColumnnContainer}
      </DragDropContext>
    </>
  );
};

export default DragDropArea;
