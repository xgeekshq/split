import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { styled } from "../../../stitches.config";
import { getAllTeams } from "../../../api/teamService";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import Box from "../../Primitives/Box";
import Tooltip from "../../Primitives/Tooltip";
import MainBoardCard from "./MainBoardCard";
import {
  CreateBoardData,
  createBoardDataState,
} from "../../../store/createBoard/atoms/create-board.atom";
import QuickEditSubTeams from "./QuickEditSubTeams";
import { getStakeholders } from "../../../api/boardService";
import Icon from "../../icons/Icon";

const StyledBox = styled(Flex, Box, { borderRadius: "$12", backgroundColor: "white" });

const TeamSubTeamsConfigurations = () => {
  const { data, isLoading } = useQuery("teams", () => getAllTeams(), { suspense: false });

  const { data: stakeHolders } = useQuery("stakeholders", () => getStakeholders(), {
    suspense: false,
  });

  const setBoardData = useSetRecoilState<CreateBoardData>(createBoardDataState);

  useEffect(() => {
    const team = data ? data[0] : null;
    if (team) {
      setBoardData((prev) => ({ ...prev, board: { ...prev.board, team: team?._id } }));
    }
  }, [data, setBoardData]);

  if (!data) return null;
  const team = data[0];
  return isLoading ? (
    <h1>Loading</h1>
  ) : (
    <Flex css={{ mt: "$32" }} direction="column">
      <Flex gap="22" justify="between" css={{ width: "100%" }}>
        <StyledBox
          elevation="1"
          direction="column"
          gap="2"
          css={{ width: "100%", py: "$12", pl: "$17", pr: "$16" }}
        >
          <Text size="xs" color="primary300">
            Team
          </Text>
          <Flex gap="8" align="center">
            <Text size="md">{team.name}</Text>
            <Text size="md" color="primary300">
              ({team.users.length} members)
            </Text>
            <Tooltip content="All active members on the platform">
              <div>
                <Icon
                  name="info"
                  css={{
                    width: "$14",
                    height: "$14",
                    color: "$primary400",
                  }}
                />
              </div>
            </Tooltip>
          </Flex>
        </StyledBox>
        <StyledBox
          elevation="1"
          direction="column"
          gap="2"
          css={{ width: "100%", py: "$12", pl: "$17", pr: "$16" }}
        >
          <Text size="xs" color="primary300">
            Stakeholders
          </Text>
          <Text size="md" css={{ wordBreak: "break-word" }}>
            {team.users
              .filter((teamUser) => stakeHolders?.includes(teamUser.user.email))
              .map(
                (stakeholders) => `${stakeholders.user.firstName} ${stakeholders.user.lastName}`
              )}
          </Text>
        </StyledBox>
      </Flex>
      <QuickEditSubTeams team={team} />
      <MainBoardCard team={team} />
    </Flex>
  );
};

export default TeamSubTeamsConfigurations;
