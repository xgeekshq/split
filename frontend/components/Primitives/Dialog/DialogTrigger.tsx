import { Trigger } from "@radix-ui/react-dialog";
import React from "react";
import { styled, CSS } from "../../../stitches.config";
import Box from "../Box";

const StyledTrigger = styled(Trigger, Box, {
  borderRadius: "$40",
  backgroundColor: "White",
  justifyContent: "center",
  size: "10rem",
  alignItems: "center",
  p: "$8",
  border: "none",
});
// type StyledPropsType = { styledProps: { align: string; color: string; direction: string } };

type DialogTriggerPrimitiveProps = React.ComponentProps<typeof Trigger> &
  React.ComponentProps<typeof StyledTrigger>;
type DialogTriggerProps = DialogTriggerPrimitiveProps & { css?: CSS };

const DialogTrigger = React.forwardRef<React.ElementRef<typeof StyledTrigger>, DialogTriggerProps>(
  ({ children, ...props }, forwardedRef) => (
    <StyledTrigger {...props} ref={forwardedRef}>
      {children}
    </StyledTrigger>
  )
);

export default DialogTrigger;
