import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
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
    <AlertDialog defaultOpen>
      <AlertDialogContent title="Delete card">
        <Text>Do you really want to delete the following card?</Text>
        <Text ellipsis fontWeight="bold">
          {cardTitle}
        </Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline" onClick={handleClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={handleDelete}>
            Delete card
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

DeleteCard.defaultProps = {
  cardItemId: undefined,
};

export default DeleteCard;
