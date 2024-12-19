import React, { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { StyledArrow, StyledContent } from '@/components/Primitives/Tooltips/Tooltip/styles';

type Props = {
  content: ReactNode;
  children: ReactNode;
  color?: 'primary800' | 'primary700' | 'primary600' | 'primary500' | 'primary100';
};

const Tooltip = ({ children, content, color }: Props) => (
  <TooltipPrimitive.TooltipProvider>
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <StyledContent
          avoidCollisions
          align="center"
          color={color}
          css={{ zIndex: 128 }}
          side="top"
        >
          {content}
          <StyledArrow color={color} height={5} width={16} />
        </StyledContent>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.TooltipProvider>
);

export default Tooltip;
