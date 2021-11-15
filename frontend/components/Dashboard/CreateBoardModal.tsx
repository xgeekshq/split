import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import * as yup from "yup";
import { PlusCircledIcon, Cross1Icon } from "@modulz/radix-icons";
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

const schema = yup
  .object()
  .shape({
    title: yup.string().max(15, "Maximum of 15 characters").required(),
  })
  .required();

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
  const { createBoard } = useBoard();
  const { isLoading, isError } = createBoard;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardType>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setFetchLoading(isLoading);
  }, [isError, isLoading, setFetchLoading]);

  // columns and cards hardcoded while dnd feature isnt implemented
  const handleClick = (data: BoardType) => {
    createBoard.mutate({
      newBoard: {
        title: data.title,
        creationDate: new Date().toISOString().slice(0, 10),
        columns: [
          { title: "todo", cards: [{ text: "t1" }], color: "red" },
          { title: "progress", cards: [{ text: "p1" }, { text: "p2" }], color: "blue" },
          {
            title: "actions",
            cards: [{ text: "a1" }, { text: "a2" }, { text: "a3" }, { text: "a4" }],
            color: "green",
          },
        ],
      },
      token: session?.accessToken,
    });
  };

  const Content = (
    <DialogContent direction="column" justify="center" css={{ width: "30vw" }}>
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
