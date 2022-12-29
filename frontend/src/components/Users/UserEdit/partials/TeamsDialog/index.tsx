import React, { Dispatch, SetStateAction, useEffect, useRef, useState, useMemo } from 'react';
import { Dialog, DialogClose, DialogTrigger, Portal } from '@radix-ui/react-dialog';

import Icon from '@/components/icons/Icon';
import Text from '@/components/Primitives/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import {
  ButtonsContainer,
  StyledDialogCloseButton,
  StyledDialogContainer,
  StyledDialogContent,
  StyledDialogOverlay,
  StyledDialogTitle,
} from '@/components/Board/Settings/styles';
import Flex from '@/components/Primitives/Flex';
import Checkbox from '@/components/Primitives/Checkbox';
import Button from '@/components/Primitives/Button';
import { useRouter } from 'next/router';

import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import useTeam from '@/hooks/useTeam';
import { AddNewBoardButton } from '@/components/layouts/DashboardLayout/styles';
import { TeamChecked } from '@/types/team/team';
import { TeamUserUpdate } from '@/types/team/team.user';
import SearchInput from './SearchInput';
import { ScrollableContent } from './styles';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

const ListTeams = ({ isOpen, setIsOpen }: Props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let teamsUserIsNotMember: TeamChecked[] = [];

  const [searchTeam, setSearchTeam] = useState<string>('');

  const router = useRouter();
  const { userId, joinedAt, providerAccountCreatedAt } = router.query;

  // References
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogContainerRef = useRef<HTMLSpanElement>(null);

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
  if (data) {
    teamsUserIsNotMember = data?.map((team) => ({ ...team, isChecked: false }));
  }

  // Method to close dialog
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeam(event.target.value);
  };

  const handleChecked = (id: string) => {
    teamsUserIsNotMember = teamsUserIsNotMember.map((team) =>
      team._id === id ? { ...team, isChecked: !team.isChecked } : team,
    );
  };

  const handleAddTeams = () => {
    const checkedTeams = teamsUserIsNotMember.filter((team) => team.isChecked);

    if (!checkedTeams) {
      setIsOpen(false);
    } else {
      const teamUsers: TeamUserUpdate[] = checkedTeams.map((team) => ({
        user: userId as string,
        role: TeamUserRoles.MEMBER,
        team: team._id,
        isNewJoiner: verifyIfIsNewJoiner(
          joinedAt as string,
          providerAccountCreatedAt ? (providerAccountCreatedAt as string) : undefined,
        ),
      }));
      mutate(teamUsers);
      setIsOpen(false);
    }
  };

  // filter
  const filteredTeams = useMemo(() => {
    const input = searchTeam.toLowerCase().trim();
    return input
      ? teamsUserIsNotMember.filter((team) => team.name.toLowerCase().trim().includes(input))
      : teamsUserIsNotMember;
  }, [searchTeam, teamsUserIsNotMember]);

  return (
    <StyledDialogContainer ref={dialogContainerRef}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <AddNewBoardButton css={{ mt: '-10px' }} size="sm">
            <Icon css={{ color: 'white' }} name="plus" />
            Add user to new team
          </AddNewBoardButton>
        </DialogTrigger>
        <Portal>
          <StyledDialogOverlay />
          <StyledDialogContent>
            <StyledDialogTitle>
              <Text heading="4">Add new team</Text>
              <DialogClose asChild>
                <StyledDialogCloseButton isIcon size="lg">
                  <Icon css={{ color: '$primary400' }} name="close" size={24} />
                </StyledDialogCloseButton>
              </DialogClose>
            </StyledDialogTitle>
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
            <ScrollableContent direction="column" justify="start" ref={scrollRef}>
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
            <ButtonsContainer gap={24} justify="end">
              <Button
                css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
                variant="primaryOutline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                css={{ marginRight: '$32', padding: '$16 $24' }}
                variant="primary"
                onClick={handleAddTeams}
              >
                Add
              </Button>
            </ButtonsContainer>
          </StyledDialogContent>
        </Portal>
      </Dialog>
    </StyledDialogContainer>
  );
};

export { ListTeams };
