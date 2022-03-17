import { CheckIcon } from "@modulz/radix-icons";
import { styled } from "../../../stitches.config";
import Button from "../../Primitives/Button";

const StyledCheckIcon = styled(CheckIcon, { size: "$20" });

interface UpdateItemProps {
  handleUpdate: () => void;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ handleUpdate }) => {
  return (
    <Button css={{ alignSelf: "end" }} onClick={handleUpdate}>
      <StyledCheckIcon />
    </Button>
  );
};

export default UpdateItem;
