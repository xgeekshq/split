import useBoard from "../../hooks/useBoard";
import { AlertDialogTrigger } from "../Primitives/AlertDialog";
import Flex from "../Primitives/Flex";
import BinIcon from "../icons/BinIcon";
import Tooltip from "../Primitives/Tooltip";
import AlertCustomDialog from "../Primitives/AlertCustomDialog";

type DeleteBoardProps = { boardId: string; boardName: string };

const DeleteBoard: React.FC<DeleteBoardProps> = ({ boardId, boardName }) => {
  const { deleteBoard } = useBoard({ autoFetchBoard: false });

  const handleDelete = () => {
    deleteBoard.mutate(boardId);
  };

  return (
    <AlertCustomDialog
      cancelText="Cancel"
      confirmText="Delete"
      handleClose={() => {}}
      handleConfirm={handleDelete}
      title="Delete board"
      defaultOpen={false}
      text={`Do you really want to delete the board “${boardName}”?`}
      css={undefined}
    >
      <Tooltip content="Delete board">
        <AlertDialogTrigger asChild>
          <Flex pointer>
            <BinIcon />
          </Flex>
        </AlertDialogTrigger>
      </Tooltip>
    </AlertCustomDialog>
  );
};

export default DeleteBoard;
