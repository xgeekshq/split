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
import EmitEvent from '@/types/events/emit-event.type';

type Props = {
  boardId: string;
  isAdmin: boolean;
  emitEvent: EmitEvent;
};

const AlertVotingPhase: React.FC<Props> = ({ boardId, isAdmin, emitEvent }) => {
  const handleVoteClick = () => {
    if (isAdmin) {
      emitEvent('board-voting.user.started', { boardId });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primaryOutline" size="sm">
          Start voting
          <Icon name="thumbs-up" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent title="Start voting phase">
        <Text>Are you sure you want to start voting phase?</Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleVoteClick}>Start Voting</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertVotingPhase;
