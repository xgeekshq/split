import { PlusCircledIcon } from "@modulz/radix-icons";
import Link from "next/link";
import { styled } from "../../stitches.config";
import Box from "../Primitives/Box";
import Text from "../Primitives/Text";

const CreateButton = styled(Box, {
  borderRadius: "$40",
  backgroundColor: "White",
  justifyContent: "center",
  size: "10rem",
  alignItems: "center",
  p: "$8",
});

const PlusIcon = styled(PlusCircledIcon, {
  size: "$40",
  mt: "$20",
  color: "$gray9",
});

const CreateBoard: React.FC = () => {
  return (
    <Link href="/boards/new-board">
      <CreateButton clickable align="center" color="white" direction="column">
        <Text>Add retro board</Text>
        <PlusIcon />
      </CreateButton>
    </Link>
  );
};

export default CreateBoard;
