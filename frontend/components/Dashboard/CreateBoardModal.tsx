import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon, Cross1Icon } from "@modulz/radix-icons";
import { styled } from "../../stitches.config";
import Text from "../Primitives/Text";
import {
  DialogCloseButton,
  DialogContent,
  DialogContentTitle,
  DialogRoot,
  DialogTrigger,
} from "../Primitives/Dialog";
import Input from "../Primitives/Input";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import useBoard from "../../hooks/useBoard";
import BoardType from "../../types/board/board";
import SchemaCreateBoard from "../../schema/schemaCreateBoardForm";

const PlusIcon = styled(PlusCircledIcon, {
  size: "$40",
  mt: "$20",
  color: "$gray9",
});

const FooterContainer = styled(Flex);

const StyledForm = styled("form", Flex);

interface CreateBoardModalProps {
  setFetchLoading: (state: boolean) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ setFetchLoading }) => {
  const { createBoard } = useBoard({ autoFetchBoard: false, autoFetchBoards: false });
  const { isLoading, isError } = createBoard;
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<BoardType>({
    resolver: zodResolver(SchemaCreateBoard),
  });

  useEffect(() => {
    setFetchLoading(isLoading);
  }, [isError, isLoading, setFetchLoading]);

  const handleClick = (data: BoardType) => {
    createBoard.mutate({
      title: data.title,
      columns: [
        { title: "todo", color: "#CDE9D6", cards: [] },
        { title: "progress", color: "#F8E8CF", cards: [] },
        { title: "actions", color: "#D2E8FD", cards: [] },
      ],
      isPublic: true,
      maxVotes: 6,
    });
  };

  return (
    <DialogRoot>
      <DialogTrigger
        interactive="clickable"
        align="center"
        radius="40"
        justify="center"
        direction="column"
      >
        <Text>Add retro board</Text>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent
        direction="column"
        justify="center"
        css={{ width: "30vw" }}
        aria-label="Create retro board"
        aria-describedby="create-board-modal"
      >
        <DialogContentTitle>New board</DialogContentTitle>
        <StyledForm direction="column" onSubmit={handleSubmit(handleClick)}>
          <Input
            type="text"
            placeholder="Board name"
            css={{ fontSize: "$xl", width: "100%", alignSelf: "center" }}
            id="title"
          />
          {!!errors.title && <Text as="p">{errors.title.message}</Text>}
          <FooterContainer justify="center">
            <Button type="submit" css={{ width: "20%", mt: "$26" }}>
              Save
            </Button>
          </FooterContainer>
        </StyledForm>
        <DialogCloseButton asChild>
          <Button>
            <Cross1Icon />
          </Button>
        </DialogCloseButton>
      </DialogContent>
    </DialogRoot>
  );
};

export default CreateBoardModal;
