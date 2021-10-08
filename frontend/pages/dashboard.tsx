import { GetStaticProps } from "next";
import { dehydrate, useQuery, QueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useStoreContext } from "../store/store";
import CreateBoard from "../components/Dashboard/CreateBoardModal";
import { styled } from "../stitches.config";
import Flex from "../components/Primitives/Flex";
import BoardsList from "../components/Dashboard/BoardList/BoardsList";
import Text from "../components/Primitives/Text";
import { BoardType } from "../types/boardTypes";
import { getBoards } from "../api/boardService";

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

  const { data } = useQuery("boards", getBoards);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    dispatch({ type: "setTitle", val: "Dashboard" });
  }, [dispatch]);

  const handleLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const handleError = (state: boolean) => {
    setIsError(state);
  };

  // while we dont a backend that provides the right data format we need to transform json data provided by firebase
  const transformedData: BoardType = {};
  if (data !== undefined)
    Object.keys(data).forEach((key) => {
      transformedData[key] = data[key];
    });
  //

  if (isLoading) return <div>Loading....</div>;
  if (isError) return <div>Error</div>;
  return (
    <Container direction="column" gap="40">
      <CreateBoard setFetchLoading={handleLoading} setFetchError={handleError} />
      <Text size="36" fontWeight="bold">
        All boards
      </Text>
      <BoardsList boards={transformedData} />
    </Container>
  );
};
export default Dashboard;
