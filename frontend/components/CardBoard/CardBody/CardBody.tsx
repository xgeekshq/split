import React, { useCallback, useMemo, useState } from "react";
import BoardType from "../../../types/board/board";
import Flex from "../../Primitives/Flex";
import { styled } from "../../../stitches.config";
import Text from "../../Primitives/Text";
import Box from "../../Primitives/Box";
import CardIcon from "../CardIcon";
import CardAvatars from "../CardAvatars";
import Tooltip from "../../Primitives/Tooltip";
import ClickEvent from "../../../types/events/clickEvent";
import LeftArrow from "./LeftArrow";
import CardEnd from "./CardEnd";
import CardTitle from "./CardTitle";
import SubBoards from "./SubBoards";
import CountCards from "./CountCards";
import CenterMainBoard from "./CenterMainBoard";
import Icon from "../../icons/Icon";

const InnerContainer = styled(Flex, Box, {
  px: "$24",
  backgroundColor: "$white",
  borderRadius: "$12",
});

const RecurrentIconContainer = styled("div", {
  width: "$12",
  height: "$12",

  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  borderRadius: "$round",

  backgroundColor: "$primary800",
  color: "white",

  cursor: "pointer",

  svg: {
    width: "$8",
    height: "$8",
  },
});

type CardBodyProps = {
  userId: string;
  board: BoardType;
  index?: number;
  dividedBoardsCount: number;
  isDashboard: boolean;
  mainBoardId?: string;
  isSAdmin?: boolean;
};

const CardBody = React.memo<CardBodyProps>(
  ({ userId, board, index, isDashboard, dividedBoardsCount, mainBoardId, isSAdmin }) => {
    const { _id: id, columns, users, team, dividedBoards, isSubBoard } = board;
    const countDividedBoards = dividedBoardsCount || dividedBoards.length;
    const [openSubBoards, setSubBoardsOpen] = useState(true);

    const userIsParticipating = useMemo(() => {
      return !!users.find((user) => user.user._id === userId);
    }, [users, userId]);

    const userIsAdmin = useMemo(() => {
      if (isSAdmin) return true;
      if (team) {
        return !!team.users.find((user) => user.role === "admin");
      }
      return !!users.find((user) => user.role === "owner");
    }, [isSAdmin, team, users]);

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
            mainBoardId={board._id}
          />
        );
      },
      [board._id, countDividedBoards, isDashboard, userId]
    );

    return (
      <Flex direction="column" css={{ flex: "1 1 0" }} gap="12">
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
                {!isSubBoard && (
                  <CardIcon board={board} isParticipating={userIsParticipating} toAdd={false} />
                )}
                <Flex align="center" gap="8">
                  <CardTitle
                    userIsParticipating={userIsParticipating}
                    boardId={id}
                    title={board.title}
                    isSubBoard={isSubBoard}
                    mainBoardId={mainBoardId}
                  />
                  {isSubBoard && (
                    <Text size="xs" color="primary300">
                      of {dividedBoardsCount}
                    </Text>
                  )}
                  {!userIsParticipating && !isDashboard && (
                    <Icon
                      name="lock"
                      css={{
                        color: "$primary300",
                        width: "17px",
                        height: "$16",
                      }}
                    />
                  )}
                  {board.recurrent && (
                    <Tooltip content="Recurrs every X week">
                      <RecurrentIconContainer>
                        <Icon name="recurring" />
                      </RecurrentIconContainer>
                    </Tooltip>
                  )}
                  {!isDashboard && isSubBoard && (
                    <CardAvatars
                      listUsers={!team ? users : team.users}
                      responsible={false}
                      teamAdmins={false}
                      userId={userId}
                    />
                  )}
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
              userIsAdmin={userIsAdmin}
              userId={userId}
              userSAdmin={isSAdmin}
            />
          </InnerContainer>
        </Flex>
        {(openSubBoards || isDashboard) && (
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
