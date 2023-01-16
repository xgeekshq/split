import AlertCustomDialog from '@/components/Primitives/AlertCustomDialog';
import useCards from '@/hooks/useCards';

interface DeleteProps {
  cardId: string;
  cardTitle: string;
  boardId: string;
  socketId: string | undefined;
  cardItemId?: string;
  userId: string;
  columnId: string;
  handleClose: () => void;
}

const DeleteCard = ({
  cardId,
  cardTitle,
  boardId,
  socketId,
  handleClose,
  cardItemId,
  userId,
  columnId,
}: DeleteProps) => {
  const { deleteCard } = useCards();

  const handleDelete = () => {
    /*
     * In some way this component or it's children is updating on an unmounted component.
     * To fix, this component must be closed before operate the async action.
     */
    handleClose();
    deleteCard.mutate({
      cardId,
      boardId,
      socketId,
      isCardGroup: !cardItemId,
      cardItemId,
      userId,
      columnId,
    });
  };

  return (
    <AlertCustomDialog
      defaultOpen
      addEllipsis={cardTitle.length > 100}
      cancelText="Cancel"
      confirmText="Delete card"
      handleClose={handleClose}
      handleConfirm={handleDelete}
      title="Delete card"
      variant="danger"
      text={
        <>
          Do you really want to delete <span>{cardTitle}</span> card?
        </>
      }
    />
  );
};

DeleteCard.defaultProps = {
  cardItemId: undefined,
};

export default DeleteCard;
