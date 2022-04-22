import Link from "next/link";
import { styled } from "../../../stitches.config";
import Text from "../../Primitives/Text";
import Flex from "../../Primitives/Flex";
import Tooltip from "../../Primitives/Tooltip";

type CardtitleProps = {
  userIsParticipating: boolean;
  boardId: string;
  title: string;
  isSubBoard: boolean | undefined;
  mainBoardId?: string;
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

const CardTitle = ({
  userIsParticipating,
  boardId,
  title,
  isSubBoard,
  mainBoardId,
}: CardtitleProps) => {
  if (isSubBoard) {
    return (
      <Tooltip content="It’s a sub-team board. A huge team got splitted into sub teams.">
        <Flex>
          {userIsParticipating && isSubBoard && (
            <Link
              key={boardId}
              href={{ pathname: `boards/[boardId]`, query: { boardId, mainBoardId } }}
            >
              <StyledBoardTitle data-disabled={!userIsParticipating}>{title}</StyledBoardTitle>
            </Link>
          )}
          {!userIsParticipating && isSubBoard && (
            <StyledBoardTitle data-disabled={!userIsParticipating}>{title}</StyledBoardTitle>
          )}
        </Flex>
      </Tooltip>
    );
  }
  return (
    <Link key={boardId} href={{ pathname: `boards/[boardId]`, query: { boardId, mainBoardId } }}>
      <StyledBoardTitle data-disabled={!userIsParticipating}>{title}</StyledBoardTitle>
    </Link>
  );
};

export default CardTitle;
