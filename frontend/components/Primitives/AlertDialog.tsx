import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { contentShow, overlayShow } from "../../animations/DialogShow";
import { styled } from "../../stitches.config";
import centerScreen from "../../styles/centerScreen";
import Card from "./Card";
import Flex from "./Flex";

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, {
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

interface AlertDialogRootProps {
  defaultOpen: boolean;
}

const Root: React.FC<AlertDialogRootProps> = ({ children, ...props }) => {
  return <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>;
};

const StyledContent = styled(AlertDialogPrimitive.Content, Flex, centerScreen, {
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  "&:focus": { outline: "none" },
});

export const AlertDialogTrigger = styled(AlertDialogPrimitive.Trigger, Card, Flex, {
  size: "$160",
  alignSelf: "center",
});

export const AlertDialog = Root;
export const AlertDialogContent = StyledContent;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogOverlay = StyledOverlay;
