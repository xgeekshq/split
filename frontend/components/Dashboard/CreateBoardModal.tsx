import { useCallback, useState, useEffect } from "react";
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

const PlusIcon = styled(PlusCircledIcon, {
  size: "$40",
  mt: "$20",
  color: "$gray9",
});

const Trigger = (
  <DialogTrigger clickable align="center" direction="column">
    <Text size="xl">Add retro board</Text>
    <PlusIcon />
  </DialogTrigger>
);

const FooterContainer = styled("div", Flex);

const CreateBoardModal: React.FC<{
  setLoading: (state: boolean) => void;
  setError: (state: boolean) => void;
}> = ({ setLoading, setError }) => {
  const [boardValue, setBoardValue] = useState("");
  const { createBoard } = useBoard();
  const { isLoading, isError } = createBoard;

  useEffect(() => {
    setLoading(isLoading);
    setError(isError);
  }, [isError, isLoading, setLoading, setError]);

  const handleClick = useCallback(() => {
    createBoard.mutate({ title: boardValue });
  }, [boardValue, createBoard]);

  const Content = (
    <DialogContent dialogTitle="New board" direction="column" justify="center">
      <TextField
        onChange={(event) => {
          setBoardValue(event.target.value);
        }}
        placeholder="Board name"
        css={{ fontSize: "$xl", width: "50%" }}
      />
      <FooterContainer justify="center">
        <Button onClick={handleClick} size="1" variant="blue" css={{ width: "20%", mt: "$16" }}>
          Save
        </Button>
      </FooterContainer>
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
