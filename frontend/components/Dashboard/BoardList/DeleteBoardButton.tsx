import { Cross1Icon } from "@modulz/radix-icons";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import IconButton from "../../Primitives/IconButton";
import Button from "../../Primitives/Button";
import useBoard from "../../../hooks/useBoard";
import Text from "../../Primitives/Text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogContent,
} from "../../Primitives/AlertDialog";
import { EditBoardTitle } from "../../../types/title";

const CloseButton = styled(AlertDialogCancel, Button, {
  position: "relative",
  top: "0",
  left: "0",
  color: "red",
});

const ActionButton = styled(AlertDialogAction, Button, {
  position: "relative",
  top: "0",
  left: "0",
  color: "red",
});

interface EditTitleWithBoardId extends EditBoardTitle {
  boardId: string;
}

const DeleteBoardButton: React.FC<EditTitleWithBoardId> = ({ boardId, isEditing, onClickEdit }) => {
  const { removeBoard } = useBoard({ autoFetchBoard: false, autoFetchBoards: false });

  const handleRemoveBoard = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (isEditing) onClickEdit(!isEditing);
    removeBoard.mutate(boardId);
  };

  const handleCloseDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (isEditing) onClickEdit(!isEditing);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger align="center" asChild>
        <IconButton size="20" onClick={(event) => event.stopPropagation()}>
          <Cross1Icon />
        </IconButton>
      </AlertDialogTrigger>
      <AlertDialogContent direction="column" onClick={(event) => event.stopPropagation()}>
        <Text>Are you sure you want to delete this board?</Text>
        <Flex justify="end" css={{ mt: "$16" }} gap="20">
          <ActionButton size="2" color="red" onClick={handleRemoveBoard}>
            Yes
          </ActionButton>
          <CloseButton
            color="blue"
            size="2"
            css={{ position: "relative" }}
            onClick={handleCloseDialog}
          >
            No
          </CloseButton>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBoardButton;
