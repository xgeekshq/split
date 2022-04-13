import Link from "next/link";
import { styled } from "../../../stitches.config";
import Text from "../../Primitives/Text";
import Flex from "../../Primitives/Flex";
import Tooltip from "../../Primitives/Tooltip";

type CardtitleProps = {
  userIsParticipating: boolean;
  boardId: string;
  title: string;
};

const StyledBoardTitle = styled(Text, {
  fontWeight: "$bold",
  fontSize: "$14",
  letterSpacing: "$0-17",
  "&[data-disabled='true']": { opacity: 0.4 },
  "@hover": {
    "&:hover": {
      "&[data-disabled='true']": { textDecoration: "none", cursor: "default" },
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
});

const CardTitle = ({ userIsParticipating, boardId, title }: CardtitleProps) => {
  if (userIsParticipating) {
    <Tooltip content="It’s a sub-team board. A huge team got splitted into sub teams.">
      <Flex>
        <Link key={boardId} href={{ pathname: `boards/[boardId]`, query: { boardId } }}>
          <StyledBoardTitle data-disabled={!userIsParticipating}>{title}</StyledBoardTitle>
        </Link>
      </Flex>
    </Tooltip>;
  }
  return (
    <Tooltip content="It’s a sub-team board. A huge team got splitted into sub teams.">
      <StyledBoardTitle data-disabled={!userIsParticipating}>{title}</StyledBoardTitle>
    </Tooltip>
  );
};

export default CardTitle;
