import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import requireAuthentication from "../../HOC/requireAuthentication";
import Text from "../../components/Primitives/Text";
import { useStoreContext } from "../../store/store";
import { styled } from "../../stitches.config";
import { ERROR_LOADING_DATA } from "../../utils/constants";
import Column from "../../components/Board/Column";
import useBoard from "../../hooks/useBoard";
import Flex from "../../components/Primitives/Flex";
import CustomDragLayer from "../../components/Board/CustomDragLayer";

const Container = styled(Flex, {
  alignItems: "flex-start",
  justifyContent: "center",
  flexWrap: "wrap",
});

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => {
  return {
    props: {},
  };
});

const Board: React.FC = () => {
  const { query } = useRouter();
  const boardId = query.boardId as string;
  const { data: session } = useSession({ required: true });
  const { fetchBoard } = useBoard({ autoFetchBoard: true, autoFetchBoards: false }, boardId);
  const { data, status } = fetchBoard;
  const {
    state: { board },
    dispatch,
  } = useStoreContext();

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_BOARD", val: data });
    }
    return () => dispatch({ type: "SET_BOARD", val: undefined });
  }, [dispatch, data]);

  if (status === "loading") return <Text>Loading ...</Text>;
  if (board && session) {
    if (!board.isPublic && session?.user.email !== board.createdBy?.email) {
      return <Text>Locked</Text>;
    }
    return (
      <DndProvider backend={HTML5Backend}>
        <CustomDragLayer />
        <Container>
          {board.columns.map((column, index) => {
            return (
              <Column key={column._id} column={column} index={index} userId={session?.user.id} />
            );
          })}
        </Container>
      </DndProvider>
    );
  }
  return <Text>{ERROR_LOADING_DATA}</Text>;
};

export default Board;
