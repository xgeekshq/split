import { CopyIcon, Cross1Icon, Pencil2Icon } from "@modulz/radix-icons";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import Button from "../../Primitives/Button";
import IconButton from "../../Primitives/IconButton";

const Container = styled("div", Flex);
const CopyUrlIcon = styled(CopyIcon, IconButton);
const EditIcon = styled(Pencil2Icon, IconButton);
const DeleteIcon = styled(Cross1Icon, IconButton);

const CardHeader: React.VFC = () => {
  return (
    <Container justify="between" css={{ alignSelf: "flex-start", width: "100%" }}>
      <Button>
        <CopyUrlIcon size="20" />
      </Button>
      <Button>
        <EditIcon size="20" />
      </Button>
      <Button>
        <DeleteIcon size="20" />
      </Button>
    </Container>
  );
};

export default CardHeader;
