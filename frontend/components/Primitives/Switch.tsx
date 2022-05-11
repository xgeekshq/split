import * as SwitchPrimitive from "@radix-ui/react-switch";
import { styled } from "../../stitches.config";
import Flex from "./Flex";

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: "unset",
  width: 42,
  height: 24,
  display: "flex",
  backgroundColor: "$primary200",
  borderRadius: "9999px",
  position: "relative",
  cursor: "pointer",
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  '&[data-state="checked"]': { backgroundColor: "$successBase" },
  boxSizing: "border-box",
});

const StyledThumb = styled(SwitchPrimitive.Thumb, Flex, {
  justifyContent: "center",
  alignItems: "center",
  width: 21,
  height: 21,
  backgroundColor: "white",
  borderRadius: "9999px",
  transition: "transform 100ms",
  transform: "translate(1.5px, 1.5px)",
  willChange: "transform",
  cursor: "pointer",
  '&[data-state="checked"]': { transform: "translate(19px, 1.5px)" },
});

export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;
