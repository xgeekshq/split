import { CopyIcon, Pencil2Icon } from "@modulz/radix-icons";
import ToastMessage from "../../../utils/toast";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import IconButton from "../../Primitives/IconButton";
import BoardType from "../../../types/board/board";
import { NEXT_PUBLIC_NEXTAUTH_URL } from "../../../utils/constants";
import DeleteBoardButton from "./DeleteBoardButton";
import { ROUTES } from "../../../utils/routes";
import EditBoardTitle from "../../../types/board/editTitle";

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

  return (
    <Container justify="between" css={{ alignSelf: "flex-start", mt: "$4", width: "100%" }}>
      <IconButton variant="ghost" size="20" onClick={handleCopyUrl}>
        <CopyUrlIcon />
      </IconButton>
      <IconButton variant="ghost" size="20" onClick={handleEditTitle}>
        <EditIcon />
      </IconButton>
      <DeleteBoardButton isEditing={isEditing} boardId={board._id} onClickEdit={onClickEdit} />
    </Container>
  );
};

export default CardHeader;
