import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { styled, keyframes } from "../../stitches.config";
import Flex from "../Primitives/Flex";
import Label from "../Primitives/Label";
import favIcon from "../../public/favicon.ico";
import Avatar from "../Primitives/Avatar";

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const DropdownMenuContent = styled(DropdownMenu.Content, {
  display: "block",
  minWidth: "$220",
  backgroundColor: "white",
  p: "$8",
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  "@media (prefers-reduced-motion: no-preference)": {
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

const DropdownMenuItem = styled(DropdownMenu.Item, {
  all: "unset",
  borderRadius: "$2",
  display: "flex",
  alignItems: "center",
  fontWeight: "$medium",
  position: "relative",
  userSelect: "none",
  px: "$8",
  py: "$6",
  "&[data-disabled]": {
    color: "mauve8",
    pointerEvents: "none",
  },

  "&:focus": {
    backgroundColor: "$gray7",
  },
});

const DropdownMenuGroup = styled(DropdownMenu.Group, Flex);

const DropdownLabel = styled(DropdownMenu.Label, Label);

const DropdownArrow = styled(DropdownMenu.Arrow, {
  fill: "white",
});

const DropdownRoot = styled(DropdownMenu.Root, {});

const Dropdown: React.FC = () => {
  return (
    <DropdownRoot>
      <DropdownMenu.Trigger asChild>
        <DropdownMenuGroup align="center" gap="6">
          <DropdownLabel fontWeight="medium" size="lg">
            Retro bot
          </DropdownLabel>
          <Avatar src={favIcon.src} size={24} />
        </DropdownMenuGroup>
      </DropdownMenu.Trigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item1</DropdownMenuItem>
        <DropdownMenuItem>Item2</DropdownMenuItem>
        <DropdownMenuItem>Item3</DropdownMenuItem>
        <DropdownArrow />
      </DropdownMenuContent>
    </DropdownRoot>
  );
};

export default Dropdown;
