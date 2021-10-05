import Link from "next/link";
import { styled } from "../../stitches.config";
import Box from "../Primitives/Box";
import Text from "../Primitives/Text";

const CreateButton = styled(Box, {
  borderRadius: "$12",
  backgroundColor: "White",
  size: "15rem",
  alignItems: "center",
  p: "$16",
});

const CreateBoard: React.FC = () => {
  return (
    <Link href="/boards/new-board">
      <CreateButton clickable align="center" color="white" direction="column">
        <Text>Add retro board</Text>
      </CreateButton>
    </Link>
  );
};

export default CreateBoard;
