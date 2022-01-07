import { useSession, signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { styled } from "../../stitches.config";
import Flex from "../Primitives/Flex";
import Label from "../Primitives/Label";
import favIcon from "../../public/favicon.ico";
import Avatar from "../Primitives/Avatar";
import {
  slideDownAndFade,
  slideLeftAndFade,
  slideUpAndFade,
  slideRightAndFade,
} from "../../animations/Slide";

const DropdownMenuContent = styled(DropdownMenu.Content, {
  display: "block",
  minWidth: "$220",
  backgroundColor: "white",
  p: "$8",
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
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
  const { data: session } = useSession({
    required: false,
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownRoot>
      <DropdownMenu.Trigger asChild>
        <DropdownMenuGroup align="center" gap="6">
          <DropdownLabel fontWeight="medium" size="18">
            {session?.user?.name ?? "anonymous"}
          </DropdownLabel>
          <Avatar src={favIcon.src} size={24} />
        </DropdownMenuGroup>
      </DropdownMenu.Trigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
        <DropdownArrow />
      </DropdownMenuContent>
    </DropdownRoot>
  );
};

export default Dropdown;
