import { EditBoardTitle } from "../../../types/board/editTitle";

interface EditTitleWithBoardId extends EditBoardTitle {
  boardId: string;
}

const DeleteBoardButton: React.FC<EditTitleWithBoardId> = () => {
  // const { deleteBoard } = useBoard({ autoFetchBoard: false, autoFetchBoards: false });

  // const handleRemoveBoard = (event: ClickEvent<HTMLButtonElement, MouseEvent>) => {
  //   event.stopPropagation();
  //   if (isEditing) onClickEdit(!isEditing);
  //   deleteBoard.mutate(boardId);
  // };

  // const handleCloseDialog = (event: ClickEvent<HTMLButtonElement, MouseEvent>) => {
  //   event.stopPropagation();
  //   if (isEditing) onClickEdit(!isEditing);
  // };

  // return (
  //   <BoardAlertDialog
  //     defaultOpen={false}
  //     text="Are you sure you want to delete this board?"
  //     handleClose={handleCloseDialog}
  //     handleConfirm={handleRemoveBoard}
  //   />
  // );
  return null;
};

export default DeleteBoardButton;
