import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import UncontrolledInput from '@/components/Primitives/Inputs/UncontrolledInput/UncontrolledInput';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import useUpdateUserTeams from '@/hooks/teams/useUpdateUserTeams';
import { TeamChecked } from '@/types/team/team';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';

export type TeamsDialogProps = {
  teamsList: TeamChecked[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  title: string;
  confirmationLabel: string;
  providerAccountCreatedAt?: string;
  joinedAt: string;
};

const TeamsDialog = ({
  isOpen,
  setIsOpen,
  title,
  confirmationLabel,
  providerAccountCreatedAt,
  joinedAt,
  teamsList,
}: TeamsDialogProps) => {
  const [searchTeam, setSearchTeam] = useState<string>('');

  const router = useRouter();
  const { userId } = router.query;

  const [teamsUserIsNotMember, setTeamsUserIsNotMember] = useState<TeamChecked[]>(teamsList);

  const { mutate } = useUpdateUserTeams(userId! as string);

  const handleClose = () => {
    setSearchTeam('');
    setIsOpen(false);
  };

  const handleChecked = (id: string) => {
    const updateTeamsUserIsNotMember: TeamChecked[] = teamsUserIsNotMember.map((team) =>
      team._id === id ? { ...team, isChecked: !team.isChecked } : team,
    );

    setTeamsUserIsNotMember(updateTeamsUserIsNotMember);
  };

  const handleAddTeams = () => {
    const teamUsers = teamsUserIsNotMember.flatMap((team) => {
      if (!team.isChecked) return [];

      const isNewJoiner = verifyIfIsNewJoiner(joinedAt, providerAccountCreatedAt || undefined);

      return {
        user: userId as string,
        role: TeamUserRoles.MEMBER,
        team: team._id,
        isNewJoiner,
        canBeResponsible: !isNewJoiner,
      };
    });

    if (!isEmpty(teamUsers)) {
      mutate(teamUsers);
    }

    setIsOpen(false);
  };

  // Filter
  const filteredTeams = useMemo(() => {
    const input = searchTeam.toLowerCase().trim();
    return input
      ? teamsUserIsNotMember.filter((team) => team.name.toLowerCase().trim().includes(input))
      : teamsUserIsNotMember;
  }, [searchTeam, teamsUserIsNotMember]);

  useEffect(() => {
    setTeamsUserIsNotMember(teamsList);
  }, [teamsList]);

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Header title={confirmationLabel} />
      <Flex css={{ p: '$32' }} direction="column">
        <UncontrolledInput
          currentValue={searchTeam}
          iconName="search"
          placeholder="Search team"
          handleChange={(e) => {
            setSearchTeam(e.target.value);
          }}
          handleClear={() => {
            setSearchTeam('');
          }}
        />
      </Flex>
      <Text css={{ display: 'block', px: '$32', pb: '$24' }} heading="4">
        {title}
      </Text>
      <Flex direction="column" gap={8}>
        <Flex align="center" css={{ px: '$32' }}>
          <Flex css={{ flex: 1 }}>
            <Flex align="center" gap={8}>
              <Checkbox disabled id="selectAll" size="md" />
              <Text heading={5}>Name</Text>
            </Flex>
          </Flex>
        </Flex>
        <Separator orientation="horizontal" />
      </Flex>
      <Flex
        css={{ height: '100%', overflowY: 'auto', py: '$16' }}
        direction="column"
        justify="start"
      >
        <Flex css={{ px: '$32' }} direction="column" gap={20}>
          {filteredTeams?.map((team) => (
            <Flex key={team._id} align="center" data-testid="checkboxTeamItem">
              <Flex css={{ flex: 1 }}>
                <Checkbox
                  checked={team.isChecked}
                  id={team._id}
                  label={team.name}
                  size="md"
                  handleChange={() => {
                    handleChecked(team._id);
                  }}
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Dialog.Footer
        affirmativeLabel="Add"
        handleAffirmative={handleAddTeams}
        handleClose={handleClose}
      />
    </Dialog>
  );
};

export default TeamsDialog;
