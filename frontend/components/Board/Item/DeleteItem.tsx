import useBoard from "../../../hooks/useBoard";
import ClickEvent from "../../../types/events/clickEvent";
import BoardAlertDialog from "../BoardAlertDialog";

interface DeleteProps {
  type: string;
  itemId: string;
  cardId: string;
  cardItemId?: string;
  boardId: string;
  socketId: string | undefined;
}

const DeleteItem: React.FC<DeleteProps> = ({ type, itemId, socketId, boardId }) => {
  const { deleteCard } = useBoard({ autoFetchBoard: false, autoFetchBoards: false });

  const handleDelete = (event: ClickEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (type === "CARD") {
      deleteCard.mutate({
        cardId: itemId,
        boardId,
        socketId,
      });
    }
  };

  return (
    <BoardAlertDialog
      defaultOpen={false}
      text={`Are you sure you want to delete this ${type.toLowerCase()}?`}
      handleClose={(e) => e.stopPropagation()}
      handleConfirm={handleDelete}
    />
  );
};

export default DeleteItem;
