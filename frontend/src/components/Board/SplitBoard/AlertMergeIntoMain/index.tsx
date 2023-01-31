import Icon from '@/components/icons/Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import useCards from '@/hooks/useCards';

type Props = {
  boardId: string;
  socketId?: string;
};
const AlertMergeIntoMain: React.FC<Props> = ({ boardId, socketId }) => {
  const { mergeBoard } = useCards();

  const handleMergeClick = () => {
    mergeBoard.mutate({ subBoardId: boardId, socketId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primaryOutline" size="sm">
          Merge into main board
          <Icon name="merge" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent title="Merge board into main board">
        <Text>
          If you merge your sub-team&apos;s board into the main board it can not be edited anymore
          afterwards. Are you sure you want to merge it?
        </Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMergeClick}>Merge into main board</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertMergeIntoMain;
