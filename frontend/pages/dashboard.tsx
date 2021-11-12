import { useQuery } from "react-query";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useSession, getSession, GetSessionParams } from "next-auth/react";
import { useStoreContext } from "../store/store";
import CreateBoard from "../components/Dashboard/CreateBoardModal";
import { styled } from "../stitches.config";
import Flex from "../components/Primitives/Flex";
import BoardsList from "../components/Dashboard/BoardList/BoardsList";
import Text from "../components/Primitives/Text";
import { getBoards } from "../api/boardService";
import { ERROR_LOADING_DATA } from "../utils/constants";

export async function getServerSideProps(context: GetSessionParams | undefined): Promise<
  | {
      redirect: {
        destination: string;
        permanent: boolean;
      };
      props?: undefined;
    }
  | {
      props: {
        session: Session;
      };
      redirect?: undefined;
    }
> {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const Container = styled("div", Flex);

const Dashboard: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const { dispatch } = useStoreContext();
  const { data } = useQuery("boards", () => getBoards(session?.accessToken), {
    retry: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: "setTitle", val: "Dashboard" });
  }, [dispatch, session]);

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
