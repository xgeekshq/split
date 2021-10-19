import { useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { QueryClient, dehydrate, useQuery } from "react-query";
import { DragDropContext } from "react-beautiful-dnd";
import Text from "../../components/Primitives/Text";
import { useStoreContext } from "../../store/store";
import { getBoard, getBoards } from "../../api/boardService";
import Column from "../../components/Board/Column";
import { styled } from "../../stitches.config";
import Flex from "../../components/Primitives/Flex";

interface PathType {
  params: BoardKeyType;
}

interface BoardKeyType {
  [boardId: string]: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.boardId?.toString();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("board", () => getBoard(id));
  return {
    props: {
      boardId: id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const boards = await getBoards();

  const paths: PathType[] = boards.map((board) => {
    return {
      params: {
        boardId: board?.id?.toString() ?? "none",
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

const Container = styled(Flex, {});

const Board: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { data, status } = useQuery("board", async () => getBoard(boardId));

  const { dispatch } = useStoreContext();

  useEffect(() => {
    if (data) dispatch({ type: "setTitle", val: data.title });
  }, [dispatch, data]);

  const onDragEnd = () => {
    //   const { destination, source, draggableId } = result;
    //   if (!destination) {
    //     return;
    //   }
    //   // if (destination.droppableId === source.droppableId && destination.index === source.index) {
    //   // }
    //   return;
  };

  if (status === "loading") return <Text>Loading ...</Text>;
  if (data) {
    return (
      // <DragDropContext onDragEnd={onDragEnd}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {Object.keys(data?.columns).map((title) => {
            const column = data.columns[title];
            return <Column key={title} title={title} column={column} cards={column.cards} />;
          })}
        </Container>
      </DragDropContext>
    );
  }
  return <Text>Error getting board data</Text>;
};

export default Board;
