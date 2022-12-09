import React, { useEffect } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { styled } from '@/styles/stitches/stitches.config';

import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

import {
  CreateBoardData,
  createBoardDataState,
  createBoardTeam,
} from '@/store/createBoard/atoms/create-board.atom';

import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import useTeam from '@/hooks/useTeam';
import MainBoardCard from './MainBoardCard';
import QuickEditSubTeams from './QuickEditSubTeams';
// eslint-disable-next-line import/no-named-as-default
import SelectTeam from './SelectTeam';

const StyledBox = styled(Flex, Box, { borderRadius: '$12', backgroundColor: 'white' });

type TeamSubTeamsInterface = {
  timesOpen: number;
  setTimesOpen: () => void;
};

const TeamSubTeamsConfigurations: React.FC<TeamSubTeamsInterface> = ({
  timesOpen,
  setTimesOpen,
}) => {
  // const [stakeholders, setStakeholders] = useState<User[]>([]);

  const selectedTeam = useRecoilValue(createBoardTeam);
  console.log(selectedTeam);

  const {
    fetchTeamsOfUser: { data: teams },
  } = useTeam({ autoFetchTeam: false });

  const setBoardData = useSetRecoilState<CreateBoardData>(createBoardDataState);
  // const [haveError, setHaveError] = useRecoilState(createBoardError);

  const MIN_MEMBERS = 4;

  useEffect(() => {
    const isTeamsValid = Array.isArray(teams) && teams.length > 0;

    if (
      isTeamsValid &&
      selectedTeam &&
      selectedTeam?.users?.filter((user) => user.role !== TeamUserRoles.STAKEHOLDER).length >=
        MIN_MEMBERS
    ) {
      // const isStakeholder = (userTeam: TeamUser): boolean =>
      //   userTeam.role === TeamUserRoles.STAKEHOLDER;
      // const getStakeholder = ({ user }: TeamUser): User => user;
      // const stakeholdersFound = selectedTeam.users.filter(isStakeholder).map(getStakeholder);

      setBoardData((prev) => ({ ...prev, board: { ...prev.board, team: selectedTeam._id } }));

      // const stakeholdersNames = stakeholdersFound.map((stakeholderList) => ({
      //   ...stakeholderList,
      //   firstName: stakeholderList.firstName
      //     .split(' ')
      //     .concat(stakeholderList.lastName.split(' '))[0],
      //   lastName: stakeholderList.firstName.split(' ').concat(stakeholderList.lastName.split(' '))[
      //     stakeholderList.firstName.split(' ').concat(stakeholderList.lastName.split(' ')).length -
      //       1
      //   ],
      // }));
      // setStakeholders(stakeholdersNames);
    } // else {
    //   setHaveError(true);
    // }
  }, [teams, setBoardData, selectedTeam]);

  useEffect(() => {
    if (timesOpen < 2) {
      setTimesOpen();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex css={{ mt: '$32' }} direction="column">
      <Flex css={{ width: '100%' }} gap="22" justify="between">
        <SelectTeam />

        <StyledBox
          css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
          direction="column"
          elevation="1"
          gap="2"
        >
          <Text color="primary300" size="xs">
            Stakeholders
          </Text>
          {/* <Text css={{ wordBreak: 'break-word' }} size="md">
            {!haveError &&
              stakeholders &&
              stakeholders.length > 0 &&
              stakeholders.map((value, index) =>
                index < stakeholders.length - 1
                  ? `${value.firstName} ${value.lastName}, `
                  : `${value.firstName} ${value.lastName}`,
              )}
          </Text> */}
        </StyledBox>
      </Flex>
      {selectedTeam && (
        <>
          <Flex justify="end">
            <QuickEditSubTeams team={selectedTeam} />
          </Flex>
          <MainBoardCard team={selectedTeam} timesOpen={timesOpen} />
        </>
      )}
    </Flex>
  );
};

export default TeamSubTeamsConfigurations;
