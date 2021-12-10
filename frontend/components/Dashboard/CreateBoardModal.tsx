import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { PlusCircledIcon, Cross1Icon } from "@modulz/radix-icons";
import { v4 as uuidv4 } from "uuid";
import { styled } from "../../stitches.config";
import Text from "../Primitives/Text";
import {
  DialogContent,
  DialogRoot,
  DialogCloseButton,
  DialogContentTitle,
  DialogTrigger,
} from "../Primitives/Dialog";
import TextField from "../Primitives/TextField";
import Flex from "../Primitives/Flex";
import Button from "../Primitives/Button";
import useBoard from "../../hooks/useBoard";
import { BoardType } from "../../types/board";
import IconButton from "../Primitives/IconButton";
import SchemaCreateBoard from "../../schema/schemaCreateBoardForm";

const PlusIcon = styled(PlusCircledIcon, {
  size: "$40",
  mt: "$20",
  color: "$gray9",
});

const Trigger = (
  <DialogTrigger
    interactive="clickable"
    align="center"
    radius="40"
    justify="center"
    direction="column"
  >
    <Text size="20">Add retro board</Text>
    <PlusIcon />
  </DialogTrigger>
);

const FooterContainer = styled("div", Flex);

const CreateBoardModal: React.FC<{
  setFetchLoading: (state: boolean) => void;
}> = ({ setFetchLoading }) => {
  const { data: session } = useSession({ required: false });
  const { createBoard } = useBoard({ autoFetchBoard: false, autoFetchBoards: false }, undefined);
  const { isLoading, isError } = createBoard;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardType>({
    resolver: yupResolver(SchemaCreateBoard),
  });

  useEffect(() => {
    setFetchLoading(isLoading);
  }, [isError, isLoading, setFetchLoading]);

  const handleClick = (data: BoardType) => {
    const idTodo = uuidv4();
    const idProgress = uuidv4();
    const idActions = uuidv4();

    createBoard.mutate({
      newBoard: {
        title: data.title,
        columns: [
          { _id: idTodo, title: "todo", color: "red", cardsOrder: [] },
          { _id: idProgress, title: "progress", color: "blue", cardsOrder: [] },
          { _id: idActions, title: "actions", color: "green", cardsOrder: [] },
        ],
        columnsOrder: [idTodo, idProgress, idActions],
        locked: false,
        createdBy: {
          name: session?.user.name ?? "anonymous",
          email: session?.user.email ?? "anonymous@anonymous.com",
        },
        cards: [],
      },
      token: session?.accessToken,
    });
  };

  const Content = (
    <DialogContent
      direction="column"
      justify="center"
      css={{ width: "30vw" }}
      aria-label="Create retro board"
      aria-describedby="create-board-modal"
    >
      <DialogContentTitle>New board</DialogContentTitle>
      <form onSubmit={handleSubmit((data: BoardType) => handleClick(data))}>
        <TextField
          type="text"
          placeholder="Board name"
          css={{ fontSize: "$xl", width: "50%" }}
          size="2"
          {...register("title")}
        />
        {errors.title && (
          <Text as="p" color="red" noMargin="false">
            {errors.title.message}
          </Text>
        )}
        <FooterContainer justify="center">
          <Button type="submit" size="1" color="blue" css={{ width: "20%", mt: "$26" }}>
            Save
          </Button>
        </FooterContainer>
      </form>
      <DialogCloseButton asChild>
        <IconButton variant="ghost" size="20">
          <Cross1Icon />
        </IconButton>
      </DialogCloseButton>
    </DialogContent>
  );

  return (
    <DialogRoot>
      {Trigger}
      {Content}
    </DialogRoot>
  );
};

export default CreateBoardModal;
