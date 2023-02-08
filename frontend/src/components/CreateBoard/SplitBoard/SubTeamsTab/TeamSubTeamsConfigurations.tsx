import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
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
import FakeMainBoardCard from '../FakeSettingsTabs/partials/MainBoardCard';
import BoxContainer from './BoxContainer';
import StakeholdersBox from './UsersBox';

type TeamSubTeamsConfigurationsProps = {
  previousTeam?: string;
};

const TeamSubTeamsConfigurations = React.memo<TeamSubTeamsConfigurationsProps>(
  ({ previousTeam }) => {
    const [stakeholders, setStakeholders] = useState<User[]>([]);

    const selectedTeam = useRecoilValue(createBoardTeam);

    const {
      fetchTeamsOfUser: { data: teams },
    } = useTeam();

    const haveError = useRecoilValue(createBoardError);

    useEffect(() => {
      if (selectedTeam) {
        const isStakeholder = (userTeam: TeamUser): boolean =>
          userTeam.role === TeamUserRoles.STAKEHOLDER;
        const getStakeholder = ({ user }: TeamUser): User => user;
        const stakeholdersFound = selectedTeam.users.filter(isStakeholder).map(getStakeholder);

        const stakeholdersNames = stakeholdersFound.map((stakeholderList) => ({
          ...stakeholderList,
          firstName: stakeholderList.firstName
            .split(' ')
            .concat(stakeholderList.lastName.split(' '))[0],
          lastName: stakeholderList.firstName
            .split(' ')
            .concat(stakeholderList.lastName.split(' '))[
            stakeholderList.firstName.split(' ').concat(stakeholderList.lastName.split(' '))
              .length - 1
          ],
        }));
        setStakeholders(stakeholdersNames);
      }

      return () => setStakeholders([]);
    }, [teams, selectedTeam]);

    return (
      <Flex direction="column">
        <Flex css={{ width: '100%' }} gap="22" justify="between">
          <SelectTeam previousTeam={previousTeam} />

          {haveError ? (
            <BoxContainer color="$background">
              <Text color="primary300" size="xs">
                Stakeholders
              </Text>
              <Text css={{ wordBreak: 'break-word' }} size="md" />
            </BoxContainer>
          ) : (
            <StakeholdersBox
              participants={stakeholders}
              haveError={haveError}
              title="Stakeholders"
            />
          )}
        </Flex>
        {selectedTeam ? (
          <>
            <Flex justify="end">
              <QuickEditSubTeams team={selectedTeam} />
            </Flex>

            {haveError ? <FakeMainBoardCard /> : <MainBoardCard team={selectedTeam} />}
          </>
        ) : (
          <Flex css={{ mt: '$36' }}>
            <FakeMainBoardCard />
          </Flex>
        )}
      </Flex>
    );
  },
);

export default TeamSubTeamsConfigurations;
