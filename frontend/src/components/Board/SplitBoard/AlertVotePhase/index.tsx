// import { updateBoardPhaseRequest } from '@/api/boardService';
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
// import { boardInfoState } from '@/store/board/atoms/board.atom';
// import { UpdateBoardPhase, UpdateBoardType } from '@/types/board/board';
import EmitEvent from '@/types/events/emit-event.type';
import fetchData from '@/utils/fetchData';

type Props = {
  boardId: string;
  isAdmin: boolean;
  emitEvent: EmitEvent;
  socketId: string;
};

const AlertVotingPhase: React.FC<Props> = ({ boardId, isAdmin, socketId }) => {
  const handleVoteClick = () => {
    if (isAdmin) {
      // TODO: Change fetch data to updateBoardPhaseRequest sending phase
      // const updateBoardPhase: UpdateBoardPhase = {
      //   _id: boardId,
      //   phase: 'addcards',
      // };
      // updateBoardPhaseRequest(updateBoardPhase);
      fetchData(`/boards/${boardId}/phase`, { method: 'PUT', data: { socketId } });
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
