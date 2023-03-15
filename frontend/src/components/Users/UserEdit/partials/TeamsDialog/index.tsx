import React, { Dispatch, SetStateAction, useState, useMemo, useEffect } from 'react';

import Text from '@/components/Primitives/Text/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import { useRouter } from 'next/router';

import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import useTeam from '@/hooks/useTeam';
import { TeamChecked } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';
import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import SearchInput from '@/components/Primitives/Inputs/SearchInput/SearchInput';
import { ScrollableContent } from './styles';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  providerAccountCreatedAt?: string;
  joinedAt: string;
  teamsList: TeamChecked[];
};

const ListTeams = ({ isOpen, setIsOpen, providerAccountCreatedAt, joinedAt, teamsList }: Props) => {
  const [searchTeam, setSearchTeam] = useState<string>('');

  const {
    updateAddTeamsToUser: { mutate },
  } = useTeam();

  const router = useRouter();
  const { userId } = router.query;

  const [teamsUserIsNotMember, setTeamsUserIsNotMember] = useState<TeamChecked[]>(teamsList);

  const {
    fetchTeamsUserIsNotMember: { refetch },
  } = useTeam({ autoFetchTeamsUserIsNotMember: true });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeam(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTeam('');
  };

  const handleChecked = (id: string) => {
    const updateTeamsUserIsNotMember = teamsUserIsNotMember.map((team) =>
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
      refetch();
    }

    setIsOpen(false);
  };

  // filter
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
      <Dialog.Header title="Add new team" />
      <Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
        <SearchInput
          currentValue={searchTeam}
          handleChange={handleSearchChange}
          handleClear={handleClearSearch}
          placeholder="Search team"
        />
      </Flex>
      <Text css={{ display: 'block', px: '$32', py: '$10' }} heading="4">
        Teams
      </Text>
      <ScrollableContent direction="column" justify="start">
        <Flex css={{ flex: '1 1', px: '$32' }} direction="column" gap={16}>
          {filteredTeams?.map((team) => (
            <Flex key={team._id} align="center" justify="between">
              <Flex css={{ width: '50%' }}>
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
      </ScrollableContent>
      <Dialog.Footer
        handleClose={() => {
          setIsOpen(false);
        }}
        handleAffirmative={handleAddTeams}
        affirmativeLabel="Add"
      />
    </Dialog>
  );
};

export { ListTeams };
