import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "./AlertDialog";
import Flex from "./Flex";
import Text from "./Text";
import Separator from "./Separator";
import CrossIcon from "../icons/CrossIcon";
import { CSS } from "../../stitches.config";

interface BoardAlertDialog {
  defaultOpen: boolean;
  text: string;
  cancelText: string;
  confirmText: string;
  handleConfirm: () => void;
  title: string;
  handleClose?: () => void;
  children?: React.ReactNode;
  css?: CSS;
  variant?: "primary";
}

const AlertCustomDialog: React.FC<BoardAlertDialog> = ({
  defaultOpen,
  text,
  handleClose,
  handleConfirm,
  title,
  cancelText,
  confirmText,
  children,
  css,
  variant,
}) => {
  AlertCustomDialog.defaultProps = {
    variant: "primary",
    css: undefined,
    children: undefined,
    handleClose: undefined,
  };
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      {children}
      <AlertDialogContent css={{ ...css }} handleClose={handleClose}>
        <Flex justify="between" align="center" css={{ px: "$32", py: "$24" }}>
          <Text heading="4">{title}</Text>
          <AlertDialogCancel
            isIcon
            asChild
            css={{ "@hover": { "&:hover": { cursor: "pointer" } } }}
            onClick={handleClose}
          >
            <Flex css={{ "& svg": { color: "$primary400" } }}>
              <CrossIcon size="24" />
            </Flex>
          </AlertDialogCancel>
        </Flex>
        <Separator css={{ backgroundColor: "$primary100" }} />
        <Flex direction="column" css={{ px: "$32", mt: "$24", mb: "$32" }}>
          <AlertDialogDescription>
            <Text css={{ color: "$primary400" }} size="md">
              {text}
            </Text>
          </AlertDialogDescription>
          <Flex justify="end" gap="24">
            <AlertDialogCancel variant="primaryOutline" onClick={handleClose}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction variant={variant || "danger"} onClick={handleConfirm}>
              {confirmText}
            </AlertDialogAction>
          </Flex>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertCustomDialog;
