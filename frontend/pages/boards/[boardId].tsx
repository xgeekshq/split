import React, { useEffect, useMemo, useRef, useState } from "react";
import { dehydrate, QueryClient, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { io, Socket } from "socket.io-client";
import { DragDropContext, DropResult, ResponderProvided } from "@react-forked/dnd";
import Link from "next/link";
import Select from "react-select";
import BoardHeader from "../../components/Board/Header";
import Flex from "../../components/Primitives/Flex";
import { styled } from "../../stitches.config";
import { NEXT_PUBLIC_BACKEND_URL } from "../../utils/constants";
import Column from "../../components/Board/Column/Column";
import useBoard from "../../hooks/useBoard";
import UpdateCardPositionDto from "../../types/card/updateCardPosition.dto";
import { getBoardRequest } from "../../api/boardService";
import useCards from "../../hooks/useCards";
import MergeCardsDto from "../../types/board/mergeCard.dto";
import SpinnerPage from "../../components/Loading/SpinnerPage";
import { countBoardCards } from "../../helper/board/countCards";
import Button from "../../components/Primitives/Button";
import AlertCustomDialog from "../../components/Primitives/AlertCustomDialog";
import { AlertDialogTrigger } from "../../components/Primitives/AlertDialog";
import AlertBox from "../../components/Primitives/AlertBox";

const Container = styled(Flex, {
  alignItems: "flex-start",
  justifyContent: "center",
  gap: "$8",
  height: "100%",
});

interface OptionType {
  value: string;
  label: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { boardId } = context.query;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["board", { id: boardId }], () =>
    getBoardRequest(boardId as string, context)
  );
  return {
    props: {
      key: context.query.boardId,
      dehydratedState: dehydrate(queryClient),
      mainBoardId: context.query.mainBoardId ?? null,
      boardId: context.query.boardId,
    },
  };
};

const Board: React.FC<{ boardId: string; mainBoardId?: string }> = ({ boardId, mainBoardId }) => {
  const { data: session } = useSession({ required: true });

  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const socketClient = useRef<Socket>();
  const socketId = socketClient?.current?.id;

  const { updateCardPosition, mergeCards, mergeBoard } = useCards();
  const [filter, setFilter] = useState("order");

  const { fetchBoard } = useBoard({
    autoFetchBoard: true,
  });
  const { data } = fetchBoard;

  console.log(fetchBoard);

  const board = data?.board;

  const isResponsible = board?.users.find(
    (boardUser) => boardUser.role === "responsible" && boardUser.user._id === userId
  );

  const countAllCards = useMemo(() => {
    if (board?.columns) return countBoardCards(board?.columns);
    return 0;
  }, [board?.columns]);

  useEffect(() => {
    const newSocket: Socket = io(NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:3200", {
      transports: ["polling"],
    });

    newSocket.on("connect", () => {
      newSocket.emit("join", { boardId });
    });

    newSocket.on("updateAllBoard", () => {
      queryClient.invalidateQueries(["board", { id: boardId }]);
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

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const message = result.destination
      ? `You have moved the card from position ${result.source.index + 1} to ${
          result.destination.index + 1
        }`
      : `The card has been returned to its starting position of ${result.source.index + 1}`;

    provided.announce(message);

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
        cardPosition: sourceIndex,
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
        socketId,
      };
      updateCardPosition.mutate(changes);
    }
  };

  const filteredColumns = () => {
    if (filter === "order") return board?.columns;
    const newCols = board?.columns.map((col) => ({
      ...col,
      cards: col.cards.map((card) => ({ ...card })),
    }));
    return newCols?.map((column) => {
      return {
        ...column,
        cards: column.cards.sort((a, b) => {
          const votesA = a.items.length === 1 ? a.items[0].votes.length : a.votes.length;
          const votesB = b.items.length === 1 ? b.items[0].votes.length : b.votes.length;
          return votesB - votesA;
        }),
      };
    });
  };

  if (board && userId && socketId && filteredColumns) {
    return (
      <>
        <BoardHeader board={board} />
        <Container>
          <Flex css={{ width: "100%", px: "$36" }} direction="column">
            <Flex>
              <Select
                value={{
                  value: filter,
                  label: `${filter.charAt(0).toUpperCase()}${filter.substring(1)}`,
                }}
                options={[
                  { value: "order", label: "Order" },
                  { value: "votes", label: "Votes" },
                ]}
                onChange={(option) => setFilter((option as OptionType)?.value)}
              />
            </Flex>
            {board.submitedByUser && board.submitedAt && (
              <AlertBox
                type="info"
                title={`Sub-team board successfully merged into main board ${new Date(
                  board.submitedAt
                ).toLocaleDateString()}, ${new Date(board.submitedAt).toLocaleTimeString()}`}
                text="The sub-team board can not be edited anymore. If you want to edit cards, go to the main board and edit the according card there."
              >
                <Link
                  key={mainBoardId}
                  href={{ pathname: `[boardId]`, query: { boardId: mainBoardId } }}
                >
                  <Button size="sm">Go to main board</Button>
                </Link>
              </AlertBox>
            )}
            {board.isSubBoard && !board.submitedByUser && isResponsible && (
              <AlertCustomDialog
                css={{ left: "37% !important" }}
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
                      fontWeight: "$medium",
                      my: "$20",
                      width: "206px",
                    }}
                  >
                    Merge into main board
                  </Button>
                </AlertDialogTrigger>
              </AlertCustomDialog>
            )}

            <Flex css={{ width: "100%", mt: "$32" }} gap="24">
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
                        (userFound) => (userFound.user._id as unknown as string) === userId
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
          </Flex>
        </Container>
      </>
    );
  }
  return <SpinnerPage />;
};

export default Board;
