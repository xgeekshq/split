import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  DragDropContext,
  DraggableLocation,
  DragUpdate,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import Text from "../../components/Primitives/Text";
import { useStoreContext } from "../../store/store";
import { styled } from "../../stitches.config";
import Flex from "../../components/Primitives/Flex";
import { ERROR_LOADING_DATA } from "../../utils/constants";
import Column from "../../components/Board/Column";
import useBoard from "../../hooks/useBoard";
import BoardChanges from "../../types/boardChanges";

const Container = styled(Flex);

const Board: React.FC = () => {
  const { query } = useRouter();
  const boardId = query.boardId as string;

  const { data: session } = useSession({ required: false });
  const { fetchBoard } = useBoard({ autoFetchBoard: true, autoFetchBoards: false }, boardId);
  const { data, status } = fetchBoard;
  const {
    state: { board, socket },
    dispatch,
  } = useStoreContext();

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_BOARD", val: data });
    }
    return () => dispatch({ type: "SET_BOARD", val: undefined });
  }, [dispatch, data]);

  const onDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
    const message = update.destination
      ? `You have moved the card to position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`;

    provided.announce(message);
  };

  const getChanges = useCallback(
    (
      type: string,
      source: DraggableLocation,
      destination: DraggableLocation | undefined
    ): BoardChanges => {
      switch (type) {
        case "COLUMN": {
          return { type, colIdxToAdd: destination?.index ?? 0, colIdxToRemove: source.index };
        }
        case "CARD": {
          return {
            type,
            colIdToRemove: source.droppableId,
            colIdToAdd: destination?.droppableId ?? source.droppableId,
            cardIdxToRemove: source.index,
            cardIdxToAdd: destination?.index ?? 0,
          };
        }
        default:
          return { type: "COLUMN", colIdxToAdd: 0, colIdxToRemove: 0 };
      }
    },
    []
  );

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const message = result.destination
      ? `You have moved the card from position ${result.source.index + 1} to ${
          result.destination.index + 1
        }`
      : `The card has been returned to its starting position of ${result.source.index + 1}`;

    provided.announce(message);

    const { destination, source, type } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (board && (type === "CARD" || type === "COLUMN")) {
      const changes = getChanges(type, source, destination);
      dispatch({ type, val: changes });
      socket?.emit("updateBoard", { id: boardId, changes });
    }
  };

  if (status === "loading") return <Text>Loading ...</Text>;
  if (board) {
    if (board.locked && session?.user.email !== board.createdBy.email) {
      return <Text>Locked</Text>;
    }
    return (
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {board.columnsOrder.map((columnId, index) => {
                const column = board.columns.find((col) => col._id === columnId);
                if (!column) return null;
                return <Column key={columnId} column={column} index={index} />;
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
  return <Text>{ERROR_LOADING_DATA}</Text>;
};

export default Board;
