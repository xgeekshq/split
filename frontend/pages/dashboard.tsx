import { GetStaticProps } from "next";
import { dehydrate, useQuery, QueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useStoreContext } from "../store/store";
import CreateBoard from "../components/Dashboard/CreateBoardModal";
import { styled } from "../stitches.config";
import Flex from "../components/Primitives/Flex";
import BoardsList from "../components/Dashboard/BoardList/BoardsList";
import Text from "../components/Primitives/Text";
import { getBoards } from "../api/boardService";
import { ERROR_LOADING_DATA } from "../utils/constantsHelper";

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

  useEffect(() => {
    dispatch({ type: "setTitle", val: "Dashboard" });
  }, [dispatch]);

  const handleLoading = (state: boolean) => {
    setIsLoading(state);
  };

  if (isLoading) return <div>Loading....</div>;
  if (data)
    return (
      <Container direction="column" gap="40">
        <CreateBoard setFetchLoading={handleLoading} />
        <Text size="36" fontWeight="bold">
          All boards
        </Text>
        <BoardsList boards={data} />
      </Container>
    );
  return <div>{ERROR_LOADING_DATA}</div>;
};
export default Dashboard;
