import { PlusCircledIcon } from "@modulz/radix-icons";
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
  <DialogTrigger clickable align="center" color="white" direction="column">
    <Text size="xl">Add retro board</Text>
    <PlusIcon />
  </DialogTrigger>
);

const FooterContainer = styled("div", Flex);

const Content = (
  <DialogContent dialogTitle="New board" direction="column" justify="center">
    <TextField placeholder="Board name" css={{ fontSize: "$xl", width: "50%" }} />
    <FooterContainer justify="center">
      <Button size="1" variant="blue" css={{ width: "20%", mt: "$16" }}>
        Save
      </Button>
    </FooterContainer>
  </DialogContent>
);

const CreateBoardModal: React.FC = () => {
  return (
    <Dialog>
      {Trigger}
      {Content}
    </Dialog>
  );
};

export default CreateBoardModal;
