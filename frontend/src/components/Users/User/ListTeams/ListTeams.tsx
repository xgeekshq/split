import TeamsListDialog from '@/components/Primitives/Dialogs/TeamsListDialog/TeamsListDialog';
import useTeam from '@/hooks/useTeam';
import { TeamChecked } from '@/types/team/team';
import { User } from '@/types/user/user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type ListTeamsProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
};

const ListTeams = ({ isOpen, setIsOpen, user }: ListTeamsProps) => {
  const [teamsUserIsNotMember, setTeamsUserIsNotMember] = useState<TeamChecked[]>([]);

  const {
    fetchTeamsUserIsNotMember: { data, refetch: refetchTeams },
    updateAddTeamsToUser: { mutate: mutateUserTeams },
  } = useTeam({ autoFetchTeamsOfSpecificUser: true, autoFetchTeamsUserIsNotMember: true });

  const handleAddTeams = (updatedTeams: TeamChecked[]) => {
    const teamUsers = updatedTeams.map((team) => {
      const isNewJoiner = verifyIfIsNewJoiner(
        user.joinedAt,
        user.providerAccountCreatedAt || undefined,
      );

      return {
        user: user._id,
        team: team._id,
        isNewJoiner,
        canBeResponsible: !isNewJoiner,
        role: TeamUserRoles.MEMBER,
      };
    });

    if (!isEmpty(teamUsers)) {
      mutateUserTeams(teamUsers);
      refetchTeams();
    }

    setIsOpen(false);
  };

  useEffect(() => {
    if (data) {
      // CHECK: Team Any Type must be removed!
      const checkedTeams: TeamChecked[] = data.map((team: any) => ({
        _id: team._id,
        name: team.name,
        isChecked: false,
      }));
      setTeamsUserIsNotMember(checkedTeams);
    }
  }, [data]);

  return (
    <TeamsListDialog
      teamList={teamsUserIsNotMember}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleAddTeams={handleAddTeams}
    />
  );
};

export default ListTeams;
