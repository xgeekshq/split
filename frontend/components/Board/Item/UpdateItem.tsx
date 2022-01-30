import { CheckIcon } from "@modulz/radix-icons";
import { styled } from "../../../stitches.config";
import { StyledIconButton } from "../../Primitives/Button";

const StyledCheckIcon = styled(CheckIcon, { size: "$20" });

interface UpdateItemProps {
  handleUpdate: () => void;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ handleUpdate }) => {
  return (
    <StyledIconButton css={{ alignSelf: "end" }} variant="ghost" onClick={handleUpdate}>
      <StyledCheckIcon />
    </StyledIconButton>
  );
};

export default UpdateItem;
