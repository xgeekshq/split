import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
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
import { Team } from "../../../types/team/team";
import { toastState } from "../../../store/toast/atom/toast.atom";
import { ToastStateEnum } from "../../../utils/enums/toast-types";

const StyledBox = styled(Flex, Box, { borderRadius: "$12", backgroundColor: "white" });

const TeamSubTeamsConfigurations: React.FC = () => {
  /**
   * Router Hook
   */
  const router = useRouter();

  /**
   * Recoil Atoms and hooks
   */
  const setBoardData = useSetRecoilState<CreateBoardData>(createBoardDataState);
  const setToastState = useSetRecoilState(toastState);

  /**
   * States
   */
  const [team, setTeam] = useState<Team>();
  // TODO: if stakeholders change type on future, it's necessary change the type of useStates
  const [stakeholders, setStakeholders] = useState<string[]>([]);

  /**
   * Queries to retrive data
   */
  const { data } = useQuery(["teams"], () => getAllTeams(), { suspense: false });
  const { data: dataStakeholders } = useQuery(["stakeholders"], () => getStakeholders(), {
    suspense: false,
  });

  /**
   * Use Effect to validate if exist any team created
   * If yes, save on state and on board data atom
   * If no, redirect to previous router and show a toastr
   */
  useEffect(() => {
    if (data && !data[0]) {
      setToastState({
        open: true,
        content: "You don't have any team. Please create a team first!",
        type: ToastStateEnum.ERROR,
      });
      router.back();
    } else if (data && data[0]) {
      setTeam(data[0]);
      setBoardData((prev) => ({ ...prev, board: { ...prev.board, team: data[0]._id } }));
    }
  }, [data, setBoardData, router, setToastState, team?._id]);

  /**
   * Use Effect to validate if staheolders return data
   * If ues, save on state
   */
  useEffect(() => {
    if (dataStakeholders) {
      setStakeholders(dataStakeholders);
    }
  }, [dataStakeholders]);

  return (
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
            <Text size="md">{team?.name}</Text>
            <Text size="md" color="primary300">
              ({team?.users.length} members)
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
            {team?.users
              .filter((teamUser) => stakeholders?.includes(teamUser.user.email))
              .map(
                (stakeholderFound) =>
                  `${stakeholderFound.user.firstName} ${stakeholderFound.user.lastName}`
              )}
          </Text>
        </StyledBox>
      </Flex>
      {team && (
        <>
          <Flex justify="end">
            <QuickEditSubTeams team={team} stakeholders={stakeholders} />
          </Flex>
          <MainBoardCard team={team} stakeholders={stakeholders} />
        </>
      )}
    </Flex>
  );
};

export default TeamSubTeamsConfigurations;
