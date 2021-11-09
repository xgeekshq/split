import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useStoreContext } from "../store/store";
import CreateBoard from "../components/Dashboard/CreateBoardModal";
import { styled } from "../stitches.config";
import Flex from "../components/Primitives/Flex";
import BoardsList from "../components/Dashboard/BoardList/BoardsList";
import Text from "../components/Primitives/Text";
import { getBoards } from "../api/boardService";
import { ERROR_LOADING_DATA } from "../utils/constants";
import useBoards from "../hooks/useBoards";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("boards", getBoards);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Container = styled("div", Flex);

const Dashboard: React.FC = () => {
  const { dispatch } = useStoreContext();

  const { data } = useBoards();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: "setTitle", val: "Dashboard" });
  }, [dispatch]);

  const handleLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const BoardsListContent = data ? <BoardsList boards={data} /> : <div>{ERROR_LOADING_DATA}</div>;

  if (isLoading) return <div>Loading....</div>;
  return (
    <Container direction="column" gap="40">
      <CreateBoard setFetchLoading={handleLoading} />
      <Text size="36" fontWeight="bold">
        All boards
      </Text>
      {BoardsListContent}
    </Container>
  );
};
export default Dashboard;
