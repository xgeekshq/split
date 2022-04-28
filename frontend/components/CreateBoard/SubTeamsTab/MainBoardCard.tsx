import React, { useEffect } from "react";
import { SetterOrUpdater } from "recoil";
import Text from "../../Primitives/Text";
import MainBoardIcon from "../../icons/MainBoard";
import Flex from "../../Primitives/Flex";
import Tooltip from "../../Primitives/Tooltip";
import MinusCircle from "../../icons/MinusCircle";
import PlusCircle from "../../icons/PlusCircle";
import { CreateBoardData } from "../../../store/createBoard/atoms/create-board.atom";
import { BoardToAdd } from "../../../types/board/board";
import Box from "../../Primitives/Box";
import { Team } from "../../../types/team/team";
import { styled } from "../../../stitches.config";
import Separator from "../../Primitives/Separator";
import CardAvatars from "../../CardBoard/CardAvatars";
import SubCardBoard from "./SubCardBoard";
import useCreateBoard from "../../../hooks/useCreateBoard";
import Checkbox from "../../Primitives/Checkbox";
import { BoardUserRoles } from "../../../utils/enums/board.user.roles";

const MainContainer = styled(Flex, Box, {
  backgroundColor: "white",
  height: "$76",
  width: "100%",
  borderRadius: "$12",
  px: "$24",
  py: "$22",
});

interface SubBoardListProp {
  dividedBoards: BoardToAdd[];
  setBoard: SetterOrUpdater<CreateBoardData>;
}

const SubBoardList = React.memo(({ dividedBoards, setBoard }: SubBoardListProp) => {
  return (
    <Flex css={{ mb: "$50" }} direction="column" gap="8">
      {dividedBoards.map((subBoard, index) => (
        <SubCardBoard key={subBoard.title} index={index} board={subBoard} setBoard={setBoard} />
      ))}
    </Flex>
  );
});

const MainBoardCard = React.memo(({ team }: { team: Team }) => {
  const {
    handleAddTeam,
    handleRemoveTeam,
    handleSplitBoards,
    createBoardData: { board },
    setCreateBoardData,
    canAdd,
    canReduce,
    teamMembers,
    stakeHolders,
  } = useCreateBoard(team);

  useEffect(() => {
    const teamMembersCount = teamMembers?.length ?? 0;
    if (teamMembersCount < 4 && board.dividedBoards.length !== 0) return;
    const maxUsersCount = Math.ceil(teamMembersCount / 2);
    const teamsCount = Math.ceil(teamMembersCount / maxUsersCount);

    const users = team.users.flatMap((teamUser) => {
      if (!stakeHolders?.includes(teamUser.user.email)) return [];
      return [
        {
          user: teamUser.user._id,
          role: BoardUserRoles.MEMBER,
          votesCount: 0,
        },
      ];
    });

    setCreateBoardData((prev) => ({
      ...prev,
      users,
      board: { ...prev.board, dividedBoards: handleSplitBoards(2, maxUsersCount) },
      count: {
        ...prev.count,
        teamsCount,
        maxUsersCount,
      },
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction="column" gap="8" css={{ width: "100%", height: "100%" }}>
      <MainContainer elevation="1" justify="between" align="center">
        <Flex>
          <Flex align="center" gap="8">
            <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
              <div>
                <MainBoardIcon
                  css={{
                    zIndex: 1,
                    color: "black",
                    ":nth-child(2n)": { color: "white" },
                  }}
                />
              </div>
            </Tooltip>
            <Text heading="6">{board.title}</Text>
          </Flex>
          <Flex css={{ ml: "$40" }} align="center">
            <Text size="sm" color="primary300" css={{ mr: "$8" }}>
              Sub-teams/-boards
            </Text>
            <Separator
              orientation="vertical"
              css={{ "&[data-orientation=vertical]": { height: "$12", width: 1 } }}
            />
            <Text css={{ ml: "$8" }}>{board.dividedBoards.length}</Text>
            <Flex css={{ ml: "$12" }} onClick={handleRemoveTeam}>
              <MinusCircle
                css={{
                  "& circle": {
                    fill: "white",
                    stroke: !canReduce ? "$primary200" : "$primary400",
                  },
                  "& path": {
                    color: !canReduce ? "$primary200" : "$primary400",
                  },
                  "@hover": {
                    "&:hover": {
                      cursor: canReduce ? "pointer" : "default",
                      "& circle": { fill: canReduce ? "$primary100" : "white" },
                    },
                  },
                }}
              />
            </Flex>
            <Flex onClick={handleAddTeam}>
              <PlusCircle
                css={{
                  ml: "$3",
                  "& circle": {
                    fill: "white",
                    stroke: !canAdd ? "$primary200" : "$primary400",
                  },
                  "& path": {
                    color: !canAdd ? "$primary200" : "$primary400",
                  },
                  "@hover": {
                    "&:hover": {
                      cursor: canAdd ? "pointer" : "default",
                      "& circle": { fill: canAdd ? "$primary100" : "white" },
                    },
                  },
                }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex gap="8" align="center">
          <Text weight="medium" size="sm">
            {team.name}
          </Text>
          <CardAvatars listUsers={team.users} responsible={false} teamAdmins={false} userId="1" />
        </Flex>
      </MainContainer>
      <SubBoardList dividedBoards={board.dividedBoards} setBoard={setCreateBoardData} />
      <Checkbox id="slack" label="Create Slack group for each sub-team" size="16" />
    </Flex>
  );
});

export default MainBoardCard;
