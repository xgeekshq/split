import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate, useQuery, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import {
  DragDropContext,
  DragUpdate,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import useBoard from "../../hooks/useBoard";
import Text from "../../components/Primitives/Text";
import { useStoreContext } from "../../store/store";
import { getBoard } from "../../api/boardService";
import { styled } from "../../stitches.config";
import Flex from "../../components/Primitives/Flex";
import { ERROR_LOADING_DATA } from "../../utils/constants";
import Column from "../../components/Board/Column";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.boardId?.toString();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["board", { id }], () => getBoard(id));
  return {
    props: {
      boardId: id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Container = styled(Flex);

const Board: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { data: session } = useSession({ required: false });
  const { updateBoard } = useBoard();
  const { data, status } = useQuery(["board", { id: boardId }], () => getBoard(boardId));
  const { dispatch } = useStoreContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) dispatch({ type: "setTitle", val: data.title });
  }, [dispatch, data]);

  const onDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
    const message = update.destination
      ? `You have moved the card to position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`;

    provided.announce(message);
  };

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

    if (data) {
      const newData = {
        ...data,
      };

      if (type === "column") {
        const newCol = newData.columns[source.index];
        newData.columns.splice(source.index, 1);
        newData.columns.splice(destination.index, 0, newCol);
      }

      const start = data.columns.find((col) => col._id === source.droppableId);
      const finish = data.columns.find((col) => col._id === destination.droppableId);

      if (start && finish) {
        const startColIdx = data.columns.indexOf(start);
        const newStartCards = Array.from(start.cards);
        const cardToReorder = start.cards[source.index];
        newStartCards.splice(source.index, 1);

        const finishColIdx = data.columns.indexOf(finish);
        const newFinishCards = Array.from(finish.cards);

        if (start === finish) {
          newStartCards.splice(destination.index, 0, cardToReorder);
        } else {
          newFinishCards.splice(destination.index, 0, cardToReorder);

          finish.cards = newFinishCards;
          newData.columns.splice(finishColIdx, 1, finish);
        }

        start.cards = newStartCards;
        newData.columns.splice(startColIdx, 1, start);
      }
      queryClient.setQueryData(["board", { id: data._id }], newData);
      updateBoard.mutate({ newBoard: { ...newData }, token: session?.accessToken });
    }
  };

  if (status === "loading") return <Text>Loading ...</Text>;
  if (data) {
    if (data.locked) {
      return <Text>Locked</Text>;
    }
    return (
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {data.columns.map((column, index) => {
                return (
                  <Column
                    key={column._id}
                    title={column.title}
                    column={column}
                    cards={column.cards}
                    index={index}
                    columns={data.columns}
                  />
                );
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
