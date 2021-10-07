import React from "react";
import { Cross1Icon } from "@modulz/radix-icons";
import { Content, Close, DialogTitle } from "@radix-ui/react-dialog";
import { styled, keyframes, CSS } from "../../../stitches.config";
import IconButton from "../IconButton";
import Flex from "../Flex";

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const StyledContent = styled(Content, Flex, {
  backgroundColor: "white",
  borderRadius: "$6",
  boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 25,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: "transform",
  },
  "&:focus": { outline: "none" },
});

const StyledCloseButton = styled(Close, {
  position: "absolute",
  top: "$6",
  right: "$6",
});

const Title = styled(DialogTitle, { margin: 0, mb: "$20" });

type DialogContentPrimitiveProps = React.ComponentProps<typeof Content> &
  React.ComponentProps<typeof StyledContent>;
type DialogContentProps = DialogContentPrimitiveProps & { css?: CSS } & { dialogTitle: string };

const DialogContent = React.forwardRef<React.ElementRef<typeof StyledContent>, DialogContentProps>(
  ({ children, dialogTitle, ...props }, forwardedRef) => (
    <StyledContent {...props} ref={forwardedRef}>
      <Title>{dialogTitle}</Title>
      {children}
      <StyledCloseButton asChild>
        <IconButton variant="ghost">
          <Cross1Icon />
        </IconButton>
      </StyledCloseButton>
    </StyledContent>
  )
);

export default DialogContent;
