import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import useTeam from '@/hooks/useTeam';
import { createBoardError, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { TeamUser } from '@/types/team/team.user';
import { User } from '@/types/user/user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import BoardUsersDropdown from '../../BoardUsersDropdown/BoardUsersDropdown';
import CreateMainBoardCard from './CreateMainBoardItem/CreateMainBoardItem';
import FakeBoardSection from './FakeBoardSection/FakeBoardSection';
import QuickEditSubTeams from './QuickEditSubTeams';
import SelectTeam from './SelectTeam/SelectTeam';

type SubTeamsTabProps = {
  previousTeam?: string;
};

const SubTeamsTab = React.memo<SubTeamsTabProps>(({ previousTeam }) => {
  const [stakeholders, setStakeholders] = useState<User[]>([]);
  const selectedTeam = useRecoilValue(createBoardTeam);
  const haveError = useRecoilValue(createBoardError);

  const {
    fetchTeamsOfUser: { data: teams },
  } = useTeam();

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
        lastName: stakeholderList.firstName.split(' ').concat(stakeholderList.lastName.split(' '))[
          stakeholderList.firstName.split(' ').concat(stakeholderList.lastName.split(' ')).length -
            1
        ],
      }));
      setStakeholders(stakeholdersNames);
    }

    return () => setStakeholders([]);
  }, [teams, selectedTeam]);

  return (
    <Flex direction="column">
      <Flex css={{ width: '100%' }} gap="22">
        <SelectTeam previousTeam={previousTeam} />
        <BoardUsersDropdown users={stakeholders} haveError={haveError} title="Stakeholders" />
      </Flex>
      {!haveError && selectedTeam ? (
        <>
          <Flex justify="end">
            <QuickEditSubTeams team={selectedTeam} />
          </Flex>
          <CreateMainBoardCard team={selectedTeam} />
        </>
      ) : (
        <Flex css={{ mt: '$36' }}>
          <FakeBoardSection />
        </Flex>
      )}
    </Flex>
  );
});

export default SubTeamsTab;
