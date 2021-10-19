import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PlusCircledIcon } from "@modulz/radix-icons";
import Dialog from "../Primitives/Dialog/Dialog";
import { styled } from "../../stitches.config";
import Text from "../Primitives/Text";
import DialogTrigger from "../Primitives/Dialog/DialogTrigger";
import DialogContent from "../Primitives/Dialog/DialogContent";
import TextField from "../Primitives/TextField";
import Flex from "../Primitives/Flex";
import Button from "../Primitives/Button";
import useBoard from "../../hooks/useBoard";
import { BoardType } from "../../types/boardTypes";

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
  <DialogTrigger clickable align="center" direction="column" color="">
    <Text size="20">Add retro board</Text>
    <PlusIcon />
  </DialogTrigger>
);

const FooterContainer = styled("div", Flex);

const CreateBoardModal: React.FC<{
  setFetchLoading: (state: boolean) => void;
}> = ({ setFetchLoading }) => {
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
    });
  };

  const Content = (
    <DialogContent dialogTitle="New board" direction="column" justify="center">
      <form onSubmit={handleSubmit((data) => handleClick(data))}>
        <TextField
          type="text"
          placeholder="Board name"
          css={{ fontSize: "$xl", width: "50%" }}
          {...register("title")}
        />
        {errors.title && (
          <Text as="p" color="red" noMargin="false">
            {errors.title.message}
          </Text>
        )}
        <FooterContainer justify="center">
          <Button type="submit" size="1" variant="blue" css={{ width: "20%", mt: "$16" }}>
            Save
          </Button>
        </FooterContainer>
      </form>
    </DialogContent>
  );

  return (
    <Dialog>
      {Trigger}
      {Content}
    </Dialog>
  );
};

export default CreateBoardModal;
