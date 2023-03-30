import React, { Dispatch, SetStateAction, useState, useMemo, useEffect } from 'react';

import Text from '@/components/Primitives/Text/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import { useRouter } from 'next/router';

import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import { TeamChecked } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';
import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import SearchInput from '@/components/Primitives/Inputs/SearchInput/SearchInput';
import Separator from '@/components/Primitives/Separator/Separator';
import useUpdateUserTeams from '@/hooks/teams/useUpdateUserTeams';

type TeamsDialogProps = {
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
        <SearchInput
          currentValue={searchTeam}
          handleChange={(e) => {
            setSearchTeam(e.target.value);
          }}
          handleClear={() => {
            setSearchTeam('');
          }}
          placeholder="Search team"
        />
      </Flex>
      <Text css={{ display: 'block', px: '$32', pb: '$24' }} heading="4">
        {title}
      </Text>
      <Flex direction="column" gap={8}>
        <Flex align="center" css={{ px: '$32' }}>
          <Flex css={{ flex: 1 }}>
            <Flex align="center" gap={8}>
              <Checkbox id="selectAll" size="md" disabled />
              <Text heading={5}>Name</Text>
            </Flex>
          </Flex>
        </Flex>
        <Separator orientation="horizontal" />
      </Flex>
      <Flex
        direction="column"
        justify="start"
        css={{ height: '100%', overflowY: 'auto', py: '$16' }}
      >
        <Flex css={{ px: '$32' }} direction="column" gap={20}>
          {filteredTeams?.map((team) => (
            <Flex key={team._id} align="center">
              <Flex css={{ flex: 1 }}>
                <Checkbox
                  checked={team.isChecked}
                  handleChange={() => {
                    handleChecked(team._id);
                  }}
                  id={team._id}
                  label={team.name}
                  size="md"
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Dialog.Footer
        handleAffirmative={handleAddTeams}
        handleClose={handleClose}
        affirmativeLabel="Add"
      />
    </Dialog>
  );
};

export default TeamsDialog;
