import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { styled } from "@stitches/react";
import {
  slideDownAndFade,
  slideLeftAndFade,
  slideUpAndFade,
  slideRightAndFade,
} from "../../animations/Slide";

const StyledContent = styled(HoverCardPrimitive.Content, {
  borderRadius: 6,
  padding: 20,
  width: "fit-content",
  backgroundColor: "white",
  boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  "@motion": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform, opacity",
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const StyledArrow = styled(HoverCardPrimitive.Arrow, {
  fill: "white",
});

export const HoverCardRoot = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;
export const HoverCardContent = StyledContent;
export const HoverCardArrow = StyledArrow;

const HoverCard: React.FC<{ trigger: JSX.Element }> = ({ trigger, children }) => {
  return (
    <HoverCardRoot>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent sideOffset={0}>
        {children}
        <HoverCardArrow />
      </HoverCardContent>
    </HoverCardRoot>
  );
};

export default HoverCard;
