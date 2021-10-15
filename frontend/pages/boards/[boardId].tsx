import { GetStaticProps, GetStaticPaths } from "next";
import { QueryClient, dehydrate, useQuery } from "react-query";
import { useEffect } from "react";
import Text from "../../components/Primitives/Text";
import { useStoreContext } from "../../store/store";
import { getBoard } from "../../hooks/useBoard";
import { getBoards } from "../../hooks/useBoards";

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

  const paths: PathType[] = [];
  Object.keys(boards).forEach((key) => {
    paths.push({ params: { boardId: key } });
  });
  return {
    paths,
    fallback: false,
  };
};

const Board: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { data, status } = useQuery("board", async () => getBoard(boardId));

  const { dispatch } = useStoreContext();

  useEffect(() => {
    if (data) dispatch({ type: "setTitle", val: data.title });
  }, [dispatch, data]);

  if (status === "loading") return <Text>Loading ...</Text>;
  if (status === "error") return <Text>Error getting board</Text>;
  return <div>Board body</div>;
};

export default Board;
