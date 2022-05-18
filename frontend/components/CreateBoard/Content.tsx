import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useRecoilValue, useResetRecoilState } from "recoil";
import ClickEvent from "../../types/events/clickEvent";
import Flex from "../Primitives/Flex";
import { styled } from "../../stitches.config";
import SchemaCreateBoard from "../../schema/schemaCreateBoardForm";
import Button from "../Primitives/Button";
import BoardName from "./BoardName";
import { createBoardDataState } from "../../store/createBoard/atoms/create-board.atom";
import SettingsTabs from "./SettingsTabs";
import useBoard from "../../hooks/useBoard";
import { CreateBoardDto } from "../../types/board/board";

const StyledForm = styled("form", Flex, {});

const CreateBoardContent = () => {
  const boardState = useRecoilValue(createBoardDataState);
  const resetBoardState = useResetRecoilState(createBoardDataState);
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

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

  const handleOnClickSaveBoard = (e: ClickEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault();
  };

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
  };

  useEffect(() => {
    if (status === "success") {
      resetBoardState();
    }
  }, [status, resetBoardState]);

  return (
    <StyledForm
      direction="column"
      css={{ width: "100%", height: "100%", backgroundColor: "$background" }}
      onSubmit={methods.handleSubmit(({ text, maxVotes }) => {
        saveBoard(text, maxVotes);
      })}
    >
      <Flex
        direction="column"
        css={{
          width: "100%",
          height: "100%",
          pt: "$64",
          pl: "$152",
          pr: "$92",
          overflow: "auto",
        }}
      >
        <FormProvider {...methods}>
          <BoardName mainBoardName={mainBoardName} />
          <SettingsTabs />
        </FormProvider>
      </Flex>
      <Flex justify="end" gap="24" css={{ backgroundColor: "white", py: "$16", pr: "$32" }}>
        <Button variant="lightOutline" onClick={handleOnClickSaveBoard}>
          Cancel
        </Button>
        <Button type="submit">Create board</Button>
      </Flex>
    </StyledForm>
  );
};

export default CreateBoardContent;
