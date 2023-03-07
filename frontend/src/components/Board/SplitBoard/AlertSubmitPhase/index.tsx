import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/AlertDialog';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Icon from '@/components/Primitives/Icon';
import Text from '@/components/Primitives/Text';
import useBoard from '@/hooks/useBoard';
import { UpdateBoardPhaseType } from '@/types/board/board';
import { BoardPhases } from '@/utils/enums/board.phases';

type Props = {
  boardId: string;
  isAdmin: boolean;
};

const AlertSubmitPhase: React.FC<Props> = ({ boardId, isAdmin }) => {
  const { updateBoardPhaseMutation } = useBoard({ autoFetchBoard: false });

  const handleSubmitClick = () => {
    if (isAdmin) {
      const updateBoardPhase: UpdateBoardPhaseType = {
        boardId,
        phase: BoardPhases.SUBMITTED,
      };
      updateBoardPhaseMutation.mutate(updateBoardPhase);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primaryOutline" size="sm">
          Submit Board
          <Icon name="check" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent title="Submit">
        <Text>
          If you submit your board it will block the users from voting and it can not be edited
          anymore afterwards. <br />
          Are you sure you want to submit it ?
        </Text>
        <Flex gap="16" justify="end" css={{ mt: '$24' }}>
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmitClick}>submit</AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertSubmitPhase;
