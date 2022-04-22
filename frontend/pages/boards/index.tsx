import { ReactElement, Suspense, useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { QueryClient, dehydrate } from "react-query";
import { useSession } from "next-auth/react";
import { TailSpin } from "react-loader-spinner";
import { styled } from "../../stitches.config";
import Layout from "../../components/Layout/Layout";
import Flex from "../../components/Primitives/Flex";
import Text from "../../components/Primitives/Text";
import Separator from "../../components/Primitives/Separator";
import MyBoards from "../../components/Boards/MyBoards";
import { getBoardsRequest } from "../../api/boardService";
import requireAuthentication from "../../components/HOC/requireAuthentication";
import QueryError from "../../components/Errors/QueryError";

const StyledTextTab = styled(Text, {
  pb: "$12 !important",
  lineHeight: "$20",
  "&:hover": {
    cursor: "pointer",
  },
  "&[data-activetab='true']": {
    boxSizing: "border-box",
    borderBottom: "2px solid $colors$primary800",
    fontWeight: "$bold",
    fontSize: "$16",
    letterSpacing: "$0-2",
    color: "$primary800",
  },
});

const Boards = () => {
  const [currentTab, setCurrentTab] = useState("boards");
  const { data: session } = useSession({ required: true });

  const handleSetBoardsPage = () => {
    setCurrentTab("boards");
  };

  if (!session) return null;
  return (
    <Flex css={{ mt: "$40", overflow: "scroll" }} direction="column">
      <Flex gap="32">
        <StyledTextTab
          data-activetab={currentTab === "boards"}
          size="md"
          color="primary300"
          onClick={handleSetBoardsPage}
        >
          My boards
        </StyledTextTab>
        <StyledTextTab
          css={{ "@hover": { "&:hover": { cursor: "default" } } }}
          data-activetab={currentTab === "upcoming"}
          size="md"
          color="primary300"
          // to be used in full version -> onClick={() => setCurrentTab("upcoming")}
        >
          Upcoming
        </StyledTextTab>
      </Flex>
      <Separator css={{ position: "relative", top: "-1px", zIndex: "-1" }} />
      {currentTab === "boards" && (
        <Suspense fallback={<TailSpin color="#060D16" height={80} width={80} />}>
          <QueryError>
            <MyBoards userId={session.user.id} isSuperAdmin={session.isSAdmin} />
          </QueryError>
        </Suspense>
      )}
    </Flex>
  );
};

export default Boards;

Boards.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery("boards", ({ pageParam = 0 }) =>
      getBoardsRequest(pageParam, context)
    );
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  }
);
