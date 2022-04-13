import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import useBoard from "../../hooks/useBoard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../Primitives/AlertDialog";
import Flex from "../Primitives/Flex";
import BinIcon from "../icons/BinIcon";
import CrossIcon from "../icons/CrossIcon";
import Text from "../Primitives/Text";
import Tooltip from "../Primitives/Tooltip";
import Separator from "../Sidebar/Separator";

type DeleteBoardProps = { boardId: string; boardName: string };

const DeleteBoard: React.FC<DeleteBoardProps> = ({ boardId, boardName }) => {
  const { deleteBoard } = useBoard({ autoFetchBoard: false });

  const handleDelete = () => {
    deleteBoard.mutate(boardId);
  };

  return (
    <AlertDialog>
      <Tooltip content="Delete board">
        <AlertDialogTrigger asChild>
          <Flex pointer>
            <BinIcon />
          </Flex>
        </AlertDialogTrigger>
      </Tooltip>
      <AlertDialogContent>
        <Flex justify="between" align="center" css={{ px: "$32", py: "$24" }}>
          <Text heading="4">Delete board</Text>
          <AlertDialogCancel
            isIcon
            asChild
            css={{ "@hover": { "&:hover": { cursor: "pointer" } } }}
          >
            <Flex css={{ "& svg": { color: "$primary400" } }}>
              <CrossIcon />
            </Flex>
          </AlertDialogCancel>
        </Flex>
        <Separator css={{ backgroundColor: "$primary100" }} />
        <Flex direction="column" css={{ px: "$32", mt: "$24", mb: "$32" }}>
          <AlertDialogDescription>
            <Text css={{ color: "$primary400" }} size="md">
              Do you really want to delete the board “{boardName}”?
            </Text>
          </AlertDialogDescription>
          <Flex justify="end" gap="24">
            <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="danger" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </Flex>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBoard;
