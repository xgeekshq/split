import React, { ReactNode, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { styled } from '@/styles/stitches/stitches.config';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { createBoardError, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import useTeam from '@/hooks/useTeam';
import { TeamUser } from '@/types/team/team.user';
import { User } from '@/types/user/user';
import MainBoardCard from './MainBoardCard';
import QuickEditSubTeams from './QuickEditSubTeams';
import SelectTeam from './SelectTeam';
import FakeMainBoardCard from '../fake/FakeSettingsTabs/partials/MainBoardCard';

const StyledBox = styled(Flex, Box, {
  width: '100%',
  py: '$12',
  pl: '$17',
  pr: '$16',
  borderRadius: '$4',
  border: '1px solid $primary200',
  height: '$64',
  minWidth: 0,
});

type BoxContainerProps = {
  children: ReactNode;
  color: string;
};

const BoxContainer = ({ children, color }: BoxContainerProps) => (
  <StyledBox direction="column" elevation="1" gap="2" css={{ background: color }}>
    {children}
  </StyledBox>
);

type TeamSubTeamsConfigurationsProps = {
  previousTeam?: string;
};

const TeamSubTeamsConfigurations = ({ previousTeam }: TeamSubTeamsConfigurationsProps) => {
  const [stakeholders, setStakeholders] = useState<User[]>([]);

  const selectedTeam = useRecoilValue(createBoardTeam);

  const {
    fetchTeamsOfUser: { data: teams },
  } = useTeam({ autoFetchTeam: false });

  const [haveError, setHaveError] = useRecoilState(createBoardError);

  useEffect(() => {
    const isTeamsValid = Array.isArray(teams) && teams.length > 0;

    if (isTeamsValid && selectedTeam) {
      const isStakeholder = (userTeam: TeamUser): boolean =>
        userTeam.role === TeamUserRoles.STAKEHOLDER;
      const getStakeholder = ({ user }: TeamUser): User => user;
      const stakeholdersFound = selectedTeam.users.filter(isStakeholder).map(getStakeholder);

      const stakeholdersNames = stakeholdersFound.map((stakeholderList) => ({
        ...stakeholderList,
        firstName: stakeholderList.firstName
          .split(' ')
          .concat(stakeholderList.lastName.split(' '))[0],
        lastName: stakeholderList.firstName.split(' ').concat(stakeholderList.lastName.split(' '))[
          stakeholderList.firstName.split(' ').concat(stakeholderList.lastName.split(' ')).length -
            1
        ],
      }));
      setStakeholders(stakeholdersNames);
    }
  }, [teams, selectedTeam, setHaveError]);

  return (
    <Flex css={{ mt: '$32' }} direction="column">
      <Flex css={{ width: '100%' }} gap="22" justify="between">
        <SelectTeam />

        {haveError ? (
          <BoxContainer color="$background">
            <Text color="primary300" size="xs">
              Stakeholders
            </Text>
            <Text css={{ wordBreak: 'break-word' }} size="md" />
          </BoxContainer>
        ) : (
          <BoxContainer color="white">
            <Text color="primary300" size="xs" css={{ pb: '$2' }}>
              Stakeholders
            </Text>
            <Text
              css={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              size="md"
            >
              {!haveError &&
                stakeholders &&
                stakeholders.length > 0 &&
                stakeholders.map((value) => `${value.firstName} ${value.lastName}`).join(', ')}
            </Text>
          </BoxContainer>
        )}
      </Flex>
      {selectedTeam ? (
        <>
          <Flex justify="end">
            <QuickEditSubTeams team={selectedTeam} />
          </Flex>

          {haveError ? (
            <FakeMainBoardCard />
          ) : (
            <MainBoardCard team={selectedTeam} previousTeam={previousTeam} />
          )}
        </>
      ) : (
        <Flex css={{ mt: '$36' }}>
          <FakeMainBoardCard />
        </Flex>
      )}
    </Flex>
  );
};

export default TeamSubTeamsConfigurations;
