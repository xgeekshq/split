import * as TabsPrimitive from "@radix-ui/react-tabs";
import { styled } from "../../stitches.config";
import Flex from "./Flex";

const StyledTabs = styled(TabsPrimitive.Root, {
  width: "500px",
  boxShadow: "0px 4px 54px rgba(0, 0, 0, 0.5)",
  borderRadius: "$12",
  backgroundColor: "$white",
});

const StyledList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: "flex",
  borderBottom: `1px solid var(--color-black)`,
  pb: "$48",
});

const StyledTrigger = styled(TabsPrimitive.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  backgroundColor: "white",
  height: "100%",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  lineHeight: 1,
  userSelect: "none",
  "&:first-child": { borderTopLeftRadius: "$12" },
  "&:last-child": { borderTopRightRadius: "$12" },
  borderBottom: "1px solid var(--colors-primary100)",
  '&[data-state="active"]': {
    color: "$black",
    borderBottom: "2px solid var(--colors-primaryBase)",
  },
});

const StyledContent = styled(TabsPrimitive.Content, Flex, {
  boxSizing: "border-box",
  backgroundColor: "white",
  justifyContent: "center",
  outline: "none",
  borderRadius: "$12",
  px: "$32",
  '&[data-state="inactive"]': {
    pt: "0",
    pb: "0",
  },
});

export const TabsRoot = StyledTabs;
export const TabsList = StyledList;
export const TabsTrigger = StyledTrigger;
export const TabsContent = StyledContent;
