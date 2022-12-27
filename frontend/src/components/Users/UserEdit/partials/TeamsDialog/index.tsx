import React, { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
// import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import { Dialog, DialogClose, DialogTrigger, Portal } from '@radix-ui/react-dialog';

import Icon from '@/components/icons/Icon';
import Text from '@/components/Primitives/Text';
import { usersListState, userTeamsListState } from '@/store/team/atom/team.atom';
// import { toastState } from '@/store/toast/atom/toast.atom';
// import { TeamUserRoles } from '@/utils/enums/team.user.roles';
// import { ToastStateEnum } from '@/utils/enums/toast-types';

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
// import { CreateTeamUser, TeamUserAddAndRemove } from '@/types/team/team.user';
// import { useRouter } from 'next/router';

// import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
// import useTeam from '@/hooks/useTeam';
import { AddNewBoardButton } from '@/components/layouts/DashboardLayout/styles';
import SearchInput from './SearchInput';
import { ScrollableContent } from './styles';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

const ListTeams = ({ isOpen, setIsOpen }: Props) => {
  const [searchTeam, setSearchTeam] = useState<string>('');

  const [usersList, setUsersListState] = useRecoilState(usersListState);
  const [userTeamsList] = useRecoilState(userTeamsListState);

  // const setToastState = useSetRecoilState(toastState);

  // References
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogContainerRef = useRef<HTMLSpanElement>(null);

  // Method to close dialog
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTeam(event.target.value);
  };

  const handleChecked = (id: string) => {
    const updateCheckedUser = usersList.map((user) =>
      user._id === id ? { ...user, isChecked: !user.isChecked } : user,
    );

    setUsersListState(updateCheckedUser);
  };

  const filteredList = useMemo(() => userTeamsList, [userTeamsList]);

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
                {filteredList?.map((user) => (
                  <Flex key={user._id} align="center" justify="between">
                    <Flex css={{ width: '50%' }}>
                      <Checkbox
                        checked={false}
                        handleChange={handleChecked}
                        id={user._id}
                        label={user.name}
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
              <Button css={{ marginRight: '$32', padding: '$16 $24' }} variant="primary">
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
