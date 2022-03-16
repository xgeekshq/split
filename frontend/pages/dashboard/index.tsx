import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { dehydrate, QueryClient } from "react-query";
import { useState } from "react";
import CreateBoard from "../../components/Dashboard/CreateBoardModal";
import { styled } from "../../stitches.config";
import Flex from "../../components/Primitives/Flex";
import BoardsList from "../../components/Dashboard/BoardList/BoardsList";
import Text from "../../components/Primitives/Text";
import { ERROR_LOADING_DATA } from "../../utils/constants";
import useBoard from "../../hooks/useBoard";
import { getBoardsRequest } from "../../api/boardService";
import requireAuthentication from "../../components/HOC/requireAuthentication";

const Container = styled("div", Flex);

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery("boards", () => getBoardsRequest(context));
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
);

const Dashboard: React.FC = () => {
  const { fetchBoards } = useBoard({ autoFetchBoard: false, autoFetchBoards: true });
  const { data } = fetchBoards;

  const [isLoading, setIsLoading] = useState(false);

  const handleLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const BoardsListContent = data ? <BoardsList boards={data} /> : <div>{ERROR_LOADING_DATA}</div>;

  if (isLoading) return <div>Loading....</div>;
  return (
    <Container direction="column" gap="40">
      <CreateBoard setFetchLoading={handleLoading} />
      <Text>All boards</Text>
      {BoardsListContent}
    </Container>
  );
};
export default Dashboard;
