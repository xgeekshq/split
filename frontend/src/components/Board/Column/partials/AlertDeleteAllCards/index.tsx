import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import useColumn from '@/hooks/useColumn';
import CardType from '@/types/card/card';

type AlertDeleteAllCardsProps = {
  socketId: string;

  isOpen: boolean;
  handleDialogChange: (
    openName: boolean,
    openDeleteColumn: boolean,
    openDeleteCards: boolean,
  ) => void;
  columnId: string;
  columnTitle: string;
  columnColor: string;
  cards: CardType[];
  boardId: string;
};
const AlertDeleteAllCards: React.FC<AlertDeleteAllCardsProps> = ({
  socketId,
  isOpen,
  columnColor,
  columnId,
  columnTitle,
  cards,
  boardId,
  handleDialogChange,
}) => {
  // Update Column Hook
  const {
    deleteCardsFromColumn: { mutate: mutateBoard },
  } = useColumn();

  const handleDeleteCards = () => {
    mutateBoard({
      _id: columnId,
      title: columnTitle,
      color: columnColor,
      cards,
      boardId,
      socketId,
    });

    handleDialogChange(false, false, false);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        title="Empty column of all cards"
        handleClose={() => handleDialogChange(false, false, false)}
      >
        <Text>Do you really want to remove all cards from this column?</Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel
            variant="primaryOutline"
            onClick={() => handleDialogChange(false, false, false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={handleDeleteCards}>
            Empty Column
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDeleteAllCards;
