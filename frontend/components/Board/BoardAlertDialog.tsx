import { Cross1Icon } from "@modulz/radix-icons";
import { styled } from "../../stitches.config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "../Primitives/AlertDialog";
import Button from "../Primitives/Button";
import Text from "../Primitives/Text";
import Flex from "../Primitives/Flex";
import ClickEvent from "../../types/events/clickEvent";

const CloseButton = styled(AlertDialogCancel, Button, {
  position: "relative",
  top: "0",
  left: "0",
});

const ActionButton = styled(AlertDialogAction, Button, {
  position: "relative",
  top: "0",
  left: "0",
});

const StyledCrossIcon = styled(Cross1Icon, { size: "$15" });

interface BoardAlertDialogProps {
  text: string;
  defaultOpen: boolean;
  handleConfirm: (event: ClickEvent<HTMLButtonElement, MouseEvent>) => void;
  handleClose: (event: ClickEvent<HTMLButtonElement, MouseEvent>) => void;
}

const BoardAlertDialog: React.FC<BoardAlertDialogProps> = ({
  text,
  handleConfirm,
  handleClose,
  defaultOpen,
}) => {
  const handleStopPropagation = <T,>(event: ClickEvent<T, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <AlertDialog defaultOpen={defaultOpen}>
      {!defaultOpen && (
        <AlertDialogTrigger align="center" asChild>
          <Button
            id="delete-item"
            onClick={handleStopPropagation}
            css={{ cursor: "pointer", border: "none" }}
          >
            <StyledCrossIcon />
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent
          direction="column"
          onClick={handleStopPropagation}
          css={{ width: "$400" }}
        >
          <Text>{text}</Text>
          <Flex justify="end" css={{ mt: "$16" }} gap="16">
            <ActionButton color="red" css={{ width: "10%" }} onClick={handleConfirm}>
              Yes
            </ActionButton>
            <CloseButton
              color="blue"
              css={{ position: "relative", width: "10%" }}
              onClick={handleClose}
            >
              No
            </CloseButton>
          </Flex>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default BoardAlertDialog;
