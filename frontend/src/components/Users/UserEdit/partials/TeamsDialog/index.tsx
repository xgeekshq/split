import React, { Dispatch, SetStateAction, useEffect, useRef, useState, useMemo } from 'react';

import Text from '@/components/Primitives/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Flex from '@/components/Primitives/Flex';
import Checkbox from '@/components/Primitives/Checkbox';
import { useRouter } from 'next/router';

import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import useTeam from '@/hooks/useTeam';
import { TeamChecked } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';
import Dialog from '@/components/Primitives/Dialog/index';
import SearchInput from './SearchInput';
import { ScrollableContent } from './styles';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

const ListTeams = ({ isOpen, setIsOpen }: Props) => {
  let teamsUserIsNotMember: TeamChecked[];

  const [searchTeam, setSearchTeam] = useState<string>('');

  const router = useRouter();
  const { userId, joinedAt, providerAccountCreatedAt } = router.query;

  const {
    fetchTeamsUserIsNotMember: { data, refetch },
  } = useTeam();

  const {
    updateAddTeamsToUser: { mutate },
  } = useTeam();

  // only fetch the data when the component is mounted (after button to open dialog is clicked)
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      refetch();
    }
    didMount.current = true;
  }, [isOpen, refetch]);

  // after fetching data, add the field "isChecked", to be used in the Add button
  teamsUserIsNotMember = data?.map((team) => ({ ...team, isChecked: false })) || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeam(event.target.value);
  };

  const handleChecked = (id: string) => {
    teamsUserIsNotMember = teamsUserIsNotMember.map((team) =>
      team._id === id ? { ...team, isChecked: !team.isChecked } : team,
    );
  };

  const handleAddTeams = () => {
    const teamUsers = teamsUserIsNotMember.flatMap((team) => {
      if (!team.isChecked) return [];
      return {
        user: userId as string,
        role: TeamUserRoles.MEMBER,
        team: team._id,
        isNewJoiner: verifyIfIsNewJoiner(
          joinedAt as string,
          providerAccountCreatedAt ? (providerAccountCreatedAt as string) : undefined,
        ),
      };
    });

    if (!isEmpty(teamUsers)) mutate(teamUsers);

    setIsOpen(false);
  };

  // filter
  const filteredTeams = useMemo(() => {
    const input = searchTeam.toLowerCase().trim();
    return input
      ? teamsUserIsNotMember.filter((team) => team.name.toLowerCase().trim().includes(input))
      : teamsUserIsNotMember;
  }, [searchTeam, teamsUserIsNotMember]);

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Header>
        <Text heading="4">Add new team</Text>
      </Dialog.Header>
      <Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
        <SearchInput
          currentValue={searchTeam}
          handleChange={handleSearchChange}
          icon="search"
          iconPosition="left"
          id="search"
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
                  checked={false}
                  handleChange={handleChecked}
                  id={team._id}
                  label={team.name}
                  size="16"
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </ScrollableContent>
      <Dialog.Footer
        setIsOpen={setIsOpen}
        handleAffirmative={handleAddTeams}
        affirmativeLabel="Add"
      />
    </Dialog>
  );
};

export { ListTeams };
