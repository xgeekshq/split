import { useRouter } from "next/router";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import {
  Container,
  ContentContainer,
  InnerContent,
  PageHeader,
  StyledForm,
} from "../../styles/pages/boards/new";
import Text from "../../components/Primitives/Text";
import Icon from "../../components/icons/Icon";
import Button from "../../components/Primitives/Button";
import TipBar from "../../components/CreateBoard/TipBar";
import { createBoardDataState } from "../../store/createBoard/atoms/create-board.atom";
import useBoard from "../../hooks/useBoard";
import SchemaCreateBoard from "../../schema/schemaCreateBoardForm";
import { CreateBoardDto } from "../../types/board/board";
import Flex from "../../components/Primitives/Flex";
import BoardName from "../../components/CreateBoard/BoardName";
import { toastState } from "../../store/toast/atom/toast.atom";
import { ToastStateEnum } from "../../utils/enums/toast-types";
import SettingsTabs from "../../components/CreateBoard/SettingsTabs";

const NewBoard = () => {
  const router = useRouter();

  /**
   * Recoil Atoms and Hooks
   */
  const setToastState = useSetRecoilState(toastState);
  const boardState = useRecoilValue(createBoardDataState);
  const resetBoardState = useResetRecoilState(createBoardDataState);

  /**
   * User Board Hook
   */
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

  /**
   * React Hook Form
   */
  const methods = useForm<{ text: string; maxVotes: string }>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      text: "Main board -",
      maxVotes: String(boardState.board.maxVotes) ?? "",
    },
    resolver: zodResolver(SchemaCreateBoard),
  });

  const mainBoardName = useWatch({
    control: methods.control,
    name: "text",
  });

  /**
   * Go to previous route
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * Save board
   * @param title Board Title
   * @param maxVotes Maxium number of votes allowed
   */
  const saveBoard = (title: string, maxVotes: string) => {
    const newDividedBoards: CreateBoardDto[] = boardState.board.dividedBoards.map((subBoard) => {
      const newSubBoard: CreateBoardDto = { ...subBoard, users: [], dividedBoards: [] };

      newSubBoard.hideCards = boardState.board.hideCards;
      newSubBoard.hideVotes = boardState.board.hideVotes;
      newSubBoard.postAnonymously = boardState.board.postAnonymously;
      newSubBoard.maxVotes = maxVotes;

      const users = subBoard.users.map((boardUser) => ({
        user: boardUser.user._id,
        role: boardUser.role,
      }));

      newSubBoard.users = users;

      return newSubBoard;
    });

    mutate({
      ...boardState.board,
      users: boardState.users,
      title,
      dividedBoards: newDividedBoards,
      maxVotes,
      maxUsers: boardState.count.maxUsersCount.toString(),
    });

    setToastState({
      open: true,
      content: "Board created with success!",
      type: ToastStateEnum.SUCCESS,
    });
  };

  useEffect(() => {
    if (status === "success") {
      resetBoardState();
      handleBack();
    }
  }, [status, resetBoardState, handleBack]);

  return (
    <Container>
      <PageHeader>
        <Text heading={3} weight="bold" color="primary800">
          Add new SPLIT board
        </Text>

        <Button isIcon onClick={handleBack}>
          <Icon name="close" />
        </Button>
      </PageHeader>
      <ContentContainer>
        <StyledForm
          direction="column"
          onSubmit={methods.handleSubmit(({ text, maxVotes }) => {
            saveBoard(text, maxVotes);
          })}
        >
          <InnerContent direction="column">
            <FormProvider {...methods}>
              <BoardName mainBoardName={mainBoardName} />
              <SettingsTabs />
            </FormProvider>
          </InnerContent>
          <Flex justify="end" gap="24" css={{ backgroundColor: "white", py: "$16", pr: "$32" }}>
            <Button variant="lightOutline" onClick={handleBack}>
              Cancel
            </Button>
            <Button type="submit">Create board</Button>
          </Flex>
        </StyledForm>
        <TipBar />
      </ContentContainer>
    </Container>
  );
};

export default NewBoard;

// export const getServerSideProps: GetServerSideProps = requireAuthentication(
//   async (context: GetServerSidePropsContext) => {
//     const queryClient = new QueryClient();
//
//     await queryClient.prefetchQuery("teams", () => getAllTeams());
//     await queryClient.prefetchQuery("stakeholders", () => getStakeholders());
//
//     return {
//       props: {
//         dehydratedState: dehydrate(queryClient),
//       },
//     };
//   }
// );
