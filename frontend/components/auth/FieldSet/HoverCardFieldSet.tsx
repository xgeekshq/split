import { QuestionMarkCircledIcon } from "@modulz/radix-icons";
import {
  HoverCardRoot,
  HoverCardContent,
  HoverCardArrow,
  HoverCardTrigger,
} from "../../Primitives/HoverCard";
import { styled } from "../../../stitches.config";
import UnorderedList from "../../Primitives/UnorderedList";
import Text from "../../Primitives/Text";

const ListItem = styled("li", Text, { fontSize: "$8" });

const HoverCardFieldSet: React.FC = () => {
  return (
    <HoverCardRoot>
      <HoverCardTrigger css={{ ml: "$2", pt: "1px" }}>
        <QuestionMarkCircledIcon />
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={0}
        css={{ border: "solid", borderWidth: "thin", borderColor: "black", p: "$6" }}
      >
        <UnorderedList variant="wOutMargin" css={{ pl: "$20", py: "$8", pr: "$6" }}>
          <ListItem>7 characters</ListItem>
          <ListItem>1 uppercase</ListItem>
          <ListItem>1 lowercase</ListItem>
          <ListItem>1 number</ListItem>
          <ListItem>1 special character</ListItem>
        </UnorderedList>
        <HoverCardArrow css={{ fill: "Black" }} />
      </HoverCardContent>
    </HoverCardRoot>
  );
};

export default HoverCardFieldSet;
