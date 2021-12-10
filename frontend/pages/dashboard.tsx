import { useQuery } from "react-query";
import { useState } from "react";
import { useSession, getSession, GetSessionParams } from "next-auth/react";
import CreateBoard from "../components/Dashboard/CreateBoardModal";
import { styled } from "../stitches.config";
import Flex from "../components/Primitives/Flex";
import BoardsList from "../components/Dashboard/BoardList/BoardsList";
import Text from "../components/Primitives/Text";
import { getBoards } from "../api/boardService";
import { AUTH_PATH, ERROR_LOADING_DATA } from "../utils/constants";
import { RedirectServerSideProps, SessionServerSideProps } from "../types/serverSideProps";

export async function getServerSideProps(
  context: GetSessionParams | undefined
): Promise<SessionServerSideProps | RedirectServerSideProps> {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: AUTH_PATH,
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
  const { data } = useQuery("boards", () => getBoards(session?.accessToken), {
    retry: false,
  });

  const [isLoading, setIsLoading] = useState(false);

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
