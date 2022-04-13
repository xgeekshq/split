import React, { useCallback, useMemo, useState } from "react";
import BoardType from "../../../types/board/board";
import Flex from "../../Primitives/Flex";
import { styled } from "../../../stitches.config";
import Text from "../../Primitives/Text";
import Box from "../../Primitives/Box";
import RecurrentIcon from "../../icons/Recurrent";
import Lock from "../../icons/Lock";
import CardIcon from "../CardIcon";
import CardAvatars from "../CardAvatars";
import Tooltip from "../../Primitives/Tooltip";
import ClickEvent from "../../../types/events/clickEvent";
import LeftArrow from "./LeftArrow";
import { BoardUser } from "../../../types/board/board.user";
import { TeamUser } from "../../../types/team/team.user";
import CardEnd from "./CardEnd";
import CardTitle from "./CardTitle";
import SubBoards from "./SubBoards";
import CountCards from "./CountCards";
import CenterMainBoard from "./CenterMainBoard";

const InnerContainer = styled(Flex, Box, {
  px: "$24",
  backgroundColor: "$white",
  borderRadius: "$12",
});

type CardBodyProps = {
  userId: string;
  board: BoardType;
  index?: number;
  dividedBoardsCount: number;
  isDashboard: boolean;
};

const CardBody = React.memo<CardBodyProps>(
  ({ userId, board, index, isDashboard, dividedBoardsCount }) => {
    const { _id: id, columns, users, team, dividedBoards, isSubBoard } = board;
    const countDividedBoards = dividedBoardsCount || dividedBoards.length;
    const [openSubBoards, setSubBoardsOpen] = useState(true);

    const userIsParticipating = useMemo(() => {
      if (team) {
        return !!team.users.find((user) => user.user._id === userId);
      }
      return !!users.find((user) => user.user._id === userId);
    }, [users, team, userId]);

    const userIsAdmin = useMemo(() => {
      if (team) {
        return !!team.users.find((user) => user.role === "admin");
      }
      return !!users.find((user) => user.role === "owner");
    }, [team, users]);

    const handleOpenSubBoards = (e: ClickEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      setSubBoardsOpen(!openSubBoards);
    };

    const renderCardBody = useCallback(
      (subBoard: BoardType, idx: number) => {
        return (
          <CardBody
            key={subBoard._id}
            board={subBoard}
            userId={userId}
            index={idx}
            isDashboard={isDashboard}
            dividedBoardsCount={countDividedBoards}
          />
        );
      },
      [countDividedBoards, isDashboard, userId]
    );

    const renderCardAvatars = useCallback(
      (listUsers: BoardUser[] | TeamUser[], onlyResponsible: boolean, teamAdmins: boolean) => {
        return (
          <CardAvatars
            listUsers={listUsers}
            responsible={onlyResponsible}
            teamAdmins={teamAdmins}
            userId={userId}
          />
        );
      },
      [userId]
    );

    return (
      <Flex direction="column" css={{ flex: "1 1 0" }} gap="8">
        <Flex>
          {isSubBoard && <LeftArrow isDashboard={isDashboard} index={index} />}
          <InnerContainer
            justify="between"
            align="center"
            elevation="1"
            css={{
              flex: "1 1 0",
              py: !isSubBoard ? "$22" : "$16",
              maxHeight: isSubBoard ? "$64" : "$76",
              ml: isSubBoard ? "$40" : 0,
            }}
          >
            <Flex align="center">
              <Flex gap="8" align="center">
                {!isSubBoard && <CardIcon board={board} isParticipating={userIsParticipating} />}
                <Flex align="center" gap="8">
                  <CardTitle
                    userIsParticipating={userIsParticipating}
                    boardId={id}
                    title={board.title}
                  />
                  {isSubBoard && (
                    <Text size="xs" color="primary300">
                      of {dividedBoardsCount}
                    </Text>
                  )}
                  {!userIsParticipating && !isDashboard && <Lock />}
                  {board.recurrent && (
                    <Tooltip content="Recurrs every X week">
                      <RecurrentIcon />
                    </Tooltip>
                  )}
                  {!isDashboard &&
                    isSubBoard &&
                    renderCardAvatars(!team ? users : team.users, false, false)}
                  {!isDashboard && !isSubBoard && countDividedBoards > 0 && (
                    <CenterMainBoard
                      countDividedBoards={countDividedBoards}
                      handleOpenSubBoards={handleOpenSubBoards}
                      openSubBoards={openSubBoards}
                    />
                  )}
                </Flex>
              </Flex>
              {isDashboard && <CountCards columns={columns} />}
            </Flex>
            <CardEnd
              board={board}
              isDashboard={isDashboard}
              isSubBoard={isSubBoard}
              index={index}
              renderCardAvatars={renderCardAvatars}
              userIsAdmin={userIsAdmin}
            />
          </InnerContainer>
        </Flex>
        {(openSubBoards === true || isDashboard) && (
          <SubBoards
            isDashboard={isDashboard}
            isSubBoard={isSubBoard}
            dividedBoards={dividedBoards}
            userId={userId}
            renderCardBody={renderCardBody}
          />
        )}
      </Flex>
    );
  }
);

export default CardBody;
