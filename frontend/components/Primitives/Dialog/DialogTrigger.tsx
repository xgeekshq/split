import { Trigger } from "@radix-ui/react-dialog";
import React from "react";
import { styled, CSS } from "../../../stitches.config";
import Card from "../Card";

const StyledTrigger = styled(Trigger, Card, {
  size: "$160",
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
