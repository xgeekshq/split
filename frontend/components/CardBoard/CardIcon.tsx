import BoardType from "../../types/board/board";
import MainBoardIcon from "../icons/MainBoard";
import PersonalBoardIcon from "../icons/PersonalBoard";
import TeamBoardIcon from "../icons/TeamBoard";
import isEmpty from "../../utils/isEmpty";
import Tooltip from "../Primitives/Tooltip";

type CardIconProps = { board: BoardType; toAdd: boolean; isParticipating: boolean };

const CardIcon: React.FC<CardIconProps> = ({ board, toAdd = false, isParticipating = false }) => {
  const { team, dividedBoards } = board;
  const isDividedBoardsEmpty = isEmpty(dividedBoards);
  if (!isDividedBoardsEmpty || toAdd) {
    return (
      <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
        <div>
          <MainBoardIcon
            css={{
              zIndex: 1,
              opacity: isParticipating ? 1 : 0.4,
              color: "black",
              ":nth-child(2n)": { color: "white" },
            }}
          />
        </div>
      </Tooltip>
    );
  }
  if (isDividedBoardsEmpty && team) {
    return (
      <TeamBoardIcon
        css={{
          ":nth-child(1n)": { color: "$highlight1Base" },
          ":nth-child(2n)": { "& path": { color: "$primary400" } },
          zIndex: 1,
          opacitity: isParticipating ? 1 : 0.4,
        }}
      />
    );
  }
  if (isDividedBoardsEmpty && !team) {
    return (
      <PersonalBoardIcon
        css={{
          zIndex: 1,
          opacitity: isParticipating ? 1 : 0.4,
          ":nth-child(1n)": { color: "$secondaryBase" },
          ":nth-child(2n)": { color: "$primary400" },
        }}
      />
    );
  }
  return null;
};

export default CardIcon;
