import { useCallback, useEffect, useState } from "react";
import { PlusCircledIcon } from "@modulz/radix-icons";
import useHttp from "../../hooks/useHttp";
import Dialog from "../Primitives/Dialog/Dialog";
import { styled } from "../../stitches.config";
import Text from "../Primitives/Text";
import DialogTrigger from "../Primitives/Dialog/DialogTrigger";
import DialogContent from "../Primitives/Dialog/DialogContent";
import TextField from "../Primitives/TextField";
import Flex from "../Primitives/Flex";
import Button from "../Primitives/Button";

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

const CreateBoardModal: React.FC = () => {
  const { error, data, sendRequest } = useHttp();
  const [boardValue, setBoardValue] = useState("");

  const handleClick = useCallback(() => {
    sendRequest(
      "https://dc2021-570aa-default-rtdb.europe-west1.firebasedatabase.app/boards.json",
      "GET",
      null
    );
    // save firebase
    // wait for response
    // push route
  }, [sendRequest]);

  useEffect(() => {}, [data, error, boardValue]);

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
