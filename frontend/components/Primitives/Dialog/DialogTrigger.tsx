import { Trigger } from "@radix-ui/react-dialog";
import React from "react";
import { styled, CSS } from "../../../stitches.config";
import Box from "../Box";

const StyledTrigger = styled(Trigger, Box, {
  borderRadius: "$40",
  justifyContent: "center",
  size: "$160",
  lineHeight: "$24",
  alignItems: "center",
  p: "$16",
  border: "2px solid $colors$blackA10",
});

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
