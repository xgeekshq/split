import { CopyIcon, Pencil2Icon } from "@modulz/radix-icons";
import ToastMessage from "../../../utils/toast";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import Button from "../../Primitives/Button";
import IconButton from "../../Primitives/IconButton";
import { BoardType } from "../../../types/board";
import { NEXT_PUBLIC_NEXTAUTH_URL } from "../../../utils/constants";
import DeleteBoardButton from "./DeleteBoardButton";
import { EditBoardTitle } from "../../../types/title";
import { ROUTES } from "../../../utils/routes";

const Container = styled(Flex);
const CopyUrlIcon = styled(CopyIcon, IconButton);
const EditIcon = styled(Pencil2Icon, IconButton);

interface CardHeaderType extends EditBoardTitle {
  board: BoardType;
}

const CardHeader: React.FC<CardHeaderType> = ({ board, isEditing, onClickEdit }) => {
  const handleCopyUrl = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (isEditing) onClickEdit(!isEditing);
    if (board._id)
      navigator.clipboard.writeText(`${NEXT_PUBLIC_NEXTAUTH_URL + ROUTES.BoardPage(board._id)}`);
    ToastMessage("Copied link to clipboard!", "info");
  };

  const handleEditTitle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    onClickEdit(!isEditing);
  };

  if (!board._id) return null;
  return (
    <Container
      justify="between"
      css={{ alignSelf: "flex-start", mt: "$4", width: "100%", pointerEvents: "all" }}
    >
      <Button onClick={handleCopyUrl}>
        <CopyUrlIcon size="20" />
      </Button>
      <Button onClick={handleEditTitle}>
        <EditIcon size="20" />
      </Button>
      <DeleteBoardButton isEditing={isEditing} boardId={board._id} onClickEdit={onClickEdit} />
    </Container>
  );
};

export default CardHeader;
