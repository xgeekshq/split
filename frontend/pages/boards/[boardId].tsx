import React, { useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "react-query";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { DragDropContext, DropResult, ResponderProvided } from "react-beautiful-dnd";
import Flex from "../../components/Primitives/Flex";
import Text from "../../components/Primitives/Text";
import { styled } from "../../stitches.config";
import { ERROR_LOADING_DATA, NEXT_PUBLIC_BACKEND_URL } from "../../utils/constants";
import ColumnType from "../../types/column";
import Column from "../../components/Board/Column/Column";
import useBoard from "../../hooks/useBoard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearBoard,
  setBoard,
  setChangesBoard,
  setNewCardPosition,
} from "../../store/slicer/boardSlicer";
import BoardType from "../../types/board/board";
import UpdateCardPositionDto from "../../types/card/updateCardPosition.dto";
import { getBoardRequest } from "../../api/boardService";

const Container = styled(Flex, {
  alignItems: "flex-start",
  justifyContent: "center",
  gap: "$8",
  height: "100%",
});

const ContainerSideBar = styled("div", {
  position: "absolute",
  right: 0,
  zIndex: 100,
});

interface ColumnListProps {
  columns: ColumnType[];
  boardId: string;
  userId: string;
  socketId: string;
}

const ColumnList = React.memo<ColumnListProps>(({ columns, boardId, userId, socketId }) => {
  return (
    <>
      {columns.map((column) => {
        return (
          <Column
            key={column._id}
            cards={column.cards}
            columnId={column._id}
            userId={userId}
            boardId={boardId}
            title={column.title}
            color={column.color}
            socketId={socketId}
          />
        );
      })}
    </>
  );
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { boardId } = context.query;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["board", { id: boardId }], () =>
    getBoardRequest(boardId as string, context)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Board: React.FC = () => {
  const { query } = useRouter();
  const boardId = query.boardId as string;
  const { data: session } = useSession({ required: false });
  const userId = session?.user?.id;
  const socketClient = useRef<Socket>();
  const socketId = socketClient.current?.id ?? undefined;
  const { updateCardPosition, fetchBoard } = useBoard({
    autoFetchBoard: true,
    autoFetchBoards: false,
  });
  const { data, status } = fetchBoard;
  const board = useAppSelector((state) => state.board.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data && !board) {
      dispatch(setBoard({ board: data, userId }));
    }
  }, [board, data, dispatch, userId]);

  useEffect(() => {
    const newSocket: Socket = io(NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:3200", {
      transports: ["polling"],
    });

    newSocket.on("connect", () => {
      newSocket.emit("join", { boardId });
    });

    newSocket.on("updateAllBoard", (payload: BoardType) => {
      dispatch(setChangesBoard({ board: payload }));
    });
    socketClient.current = newSocket;
  }, [boardId, dispatch]);

  useEffect(
    () => () => {
      if (socketClient.current) socketClient.current?.close();
      socketClient.current = undefined;
      dispatch(clearBoard());
    },
    [dispatch]
  );

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const message = result.destination
      ? `You have moved the card from position ${result.source.index + 1} to ${
          result.destination.index + 1
        }`
      : `The card has been returned to its starting position of ${result.source.index + 1}`;

    provided.announce(message);

    if (!board?._id || !socketId || !result) return;
    const { destination, source, combine, draggableId } = result;

    if (!source) return;

    if (!combine && !destination) {
      return;
    }

    const { droppableId: sourceDroppableId, index: sourceIndex } = source;

    if (!combine && destination) {
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
        boardId: board._id,
        socketId,
      };
      dispatch(setNewCardPosition(changes));
      updateCardPosition.mutate(changes);
    }
  };

  if (status === "loading") return <Text>Loading ...</Text>;
  if (board && userId) {
    if (!board.isPublic) {
      return <Text>Locked</Text>;
    }
    return (
      <Container>
        <DragDropContext onDragEnd={onDragEnd}>
          <ColumnList
            columns={board.columns}
            boardId={boardId}
            userId={userId}
            socketId={socketId ?? ""}
          />
        </DragDropContext>
        <ContainerSideBar
          id="sidebar"
          css={{
            top: document.getElementById("nav-bar")?.clientHeight ?? "5%",
            height: document.body.clientHeight,
          }}
        />
      </Container>
    );
  }
  return <Text>{ERROR_LOADING_DATA}</Text>;
};

export default Board;
