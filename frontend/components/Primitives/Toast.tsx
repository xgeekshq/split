import { Dispatch, SetStateAction } from "react";
import * as React from "react";
import { slate } from "@radix-ui/colors";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { styled, keyframes } from "../../stitches.config";
import AlertIcon from "../../public/icons/toast/alert.svg";
import Text from "./Text";
import { ToastStateEnum } from "../../utils/enums/toast-types";

const VIEWPORT_PADDING = 162;

const hide = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: "translateX(0)" },
});

const swipeOut = keyframes({
  from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: "fixed",
  top: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  paddingRight: VIEWPORT_PADDING,
  paddingTop: "$106",
  width: "fit-content",
  maxWidth: "100vw",
  margin: 0,
  listStyle: "none",
  zIndex: 2147483647,
});

const StyledToast = styled(ToastPrimitive.Root, {
  backgroundColor: "white",
  py: "$12",
  px: "$16",
  borderRadius: "$12",
  boxShadow: "0px 4px 16px -4px rgba(18, 25, 34, 0.2)",
  display: "flex",
  height: "$56",
  width: "$455",
  justifyContent: "space-between",
  alignItems: "center",
  direction: "raw",

  "@media (prefers-reduced-motion: no-preference)": {
    '&[data-state="open"]': {
      animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    '&[data-state="closed"]': {
      animation: `${hide} 100ms ease-in forwards`,
    },
    '&[data-swipe="move"]': {
      transform: "translateX(var(--radix-toast-swipe-move-x))",
    },
    '&[data-swipe="cancel"]': {
      transform: "translateX(0)",
      transition: "transform 200ms ease-out",
    },
    '&[data-swipe="end"]': {
      animation: `${swipeOut} 100ms ease-out forwards`,
    },
  },
});

const StyledTitle = styled(ToastPrimitive.Title, {
  gridArea: "title",
  marginBottom: 5,
  fontWeight: 500,
  color: slate.slate12,
  fontSize: 15,
});

const StyledDescription = styled(ToastPrimitive.Description, {
  display: "flex",
  gap: "$8",
  margin: 0,
  alignItems: "center",
});

const StyledAction = styled(ToastPrimitive.Action, {
  gridArea: "action",
});

const StyledClose = styled(ToastPrimitive.Close, {
  all: "none",
  border: "none",
  padding: 0,
  background: "none",
  ml: "$20",
  fontSize: "$12",
  color: "$primary400",
  textAlign: "center",
});

// Exports
export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = StyledViewport;
export const ToastRoot = StyledToast;
export const ToastTitle = StyledTitle;
export const ToastDescription = StyledDescription;
export const ToastAction = StyledAction;
export const ToastClose = StyledClose;

const Toast: React.FC<{
  type: ToastStateEnum;
  content: string;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}> = ({ type, content, children, open, onOpenChange, ...props }) => {
  Toast.defaultProps = {
    open: undefined,
    onOpenChange: undefined,
  };
  const duration = [ToastStateEnum.SUCCESS, ToastStateEnum.INFO].includes(type) ? 20000 : undefined;
  return (
    <ToastRoot
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      type="foreground"
      {...props}
    >
      <ToastDescription>
        {type === ToastStateEnum.ERROR && <AlertIcon />}
        {type === ToastStateEnum.SUCCESS && <AlertIcon />}
        {type === ToastStateEnum.WARNING && <AlertIcon />}
        {type === ToastStateEnum.INFO && <AlertIcon />}
        <Text size="sm">{content}</Text>
      </ToastDescription>
      {children && (
        <ToastAction altText={content} asChild>
          {children}
        </ToastAction>
      )}
      <ToastClose aria-label="Close">X</ToastClose>
    </ToastRoot>
  );
};

export default Toast;
