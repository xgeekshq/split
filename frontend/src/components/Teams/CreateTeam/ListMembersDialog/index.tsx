import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogClose, Portal } from '@radix-ui/react-dialog';
import Icon from '@/components/icons/Icon';
import Text from '@/components/Primitives/Text';
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
import { UserList } from '@/types/team/userList';
import { ScrollableContent } from './styles';
import SearchInput from './SearchInput';

type ListMembersDialogProps = {
  usersList: UserList[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  isTeamPage?: boolean;
  saveUsers: (checkedUserList: UserList[]) => void;
  title: string;
  btnTitle: string;
};

const ListMembersDialog = React.memo<ListMembersDialogProps>(
  ({ usersList, isOpen, setIsOpen, saveUsers, title, btnTitle }) => {
    const { data: session } = useSession({ required: true });
    const [searchMember, setSearchMember] = useState<string>('');

    const [usersChecked, setUsersChecked] = useState(usersList);

    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

    // References
    const scrollRef = useRef<HTMLDivElement>(null);
    const dialogContainerRef = useRef<HTMLSpanElement>(null);

    // Method to close dialog
    const handleClose = () => {
      setSearchMember('');
      setUsersChecked(usersList);
      setIsOpen(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchMember(event.target.value);
    };

    const handleChecked = (id: string) => {
      const updateCheckedUsers = usersChecked.map((user) =>
        user._id === id ? { ...user, isChecked: !user.isChecked } : user,
      );

      setUsersChecked(updateCheckedUsers);
    };

    const handleSelectAll = () => {
      const updateCheckedUsers = usersChecked.map((user) =>
        user._id !== session?.user.id ? { ...user, isChecked: !isCheckAll } : user,
      );

      setIsCheckAll(!isCheckAll);
      setUsersChecked(updateCheckedUsers);
    };

    const handleUpdateUsers = () => {
      setSearchMember('');
      saveUsers(usersChecked);
    };

    const filteredList = useMemo(() => {
      const searchString = searchMember.toLowerCase().trim();

      return usersChecked.filter((user) => {
        const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
        const email = user.email.toLowerCase();
        return (
          email.includes(searchString) || fullName.includes(searchString) || searchMember === ''
        );
      });
    }, [searchMember, usersChecked]);

    // Sets User List from State
    useEffect(() => {
      // SORTS
      const sortUserList = () => {
        const listToBeSorted = [...usersList];

        // Sort by Name
        listToBeSorted.sort((a, b) => {
          const aFullName = `${a.firstName.toLowerCase()} ${a.lastName.toLowerCase()}`;
          const bFullName = `${b.firstName.toLowerCase()} ${b.lastName.toLowerCase()}`;

          return aFullName < bFullName ? -1 : 1;
        });

        // Sort by Checked
        listToBeSorted.sort((a, b) => Number(b.isChecked) - Number(a.isChecked));

        // Ensure Team Admin is in First place
        const userAdminIndex = listToBeSorted.findIndex((user) => user._id === session?.user.id);
        listToBeSorted.unshift(listToBeSorted.splice(userAdminIndex, 1)[0]);

        return listToBeSorted;
      };

      setUsersChecked(sortUserList());
    }, [usersList]);

    // Update selectAll button when list is all checked
    useEffect(() => {
      setIsCheckAll(!usersChecked.map((user) => user.isChecked).includes(false));
    }, [setIsCheckAll, usersChecked]);

    return (
      <StyledDialogContainer ref={dialogContainerRef}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Portal>
            <StyledDialogOverlay />
            <StyledDialogContent onPointerDownOutside={handleClose}>
              <StyledDialogTitle>
                <Text heading="4">{btnTitle}</Text>
                <DialogClose asChild>
                  <StyledDialogCloseButton isIcon size="lg">
                    <Icon css={{ color: '$primary400' }} name="close" size={24} />
                  </StyledDialogCloseButton>
                </DialogClose>
              </StyledDialogTitle>
              <Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
                <SearchInput
                  currentValue={searchMember}
                  handleChange={handleSearchChange}
                  icon="search"
                  iconPosition="left"
                  id="search"
                  placeholder="Search member"
                />
              </Flex>
              <Text css={{ display: 'block', px: '$32', py: '$10' }} heading="4">
                {title}
              </Text>
              <ScrollableContent direction="column" justify="start" ref={scrollRef}>
                <Flex css={{ flex: '1 1', px: '$32' }} direction="column" gap={16}>
                  {filteredList?.map((user) => (
                    <Flex key={user._id} align="center" justify="between">
                      <Flex css={{ width: '50%' }}>
                        <Checkbox
                          checked={user.isChecked}
                          disabled={user._id === session?.user.id}
                          handleChange={handleChecked}
                          id={user._id}
                          label={`${user.firstName} ${user.lastName}`}
                          size="16"
                          hasSelectAll
                        />
                      </Flex>
                      <Flex css={{ width: '50%' }}>
                        <Text
                          color="primary300"
                          css={{ textAlign: 'left', width: '50%' }}
                          size="sm"
                        >
                          {user.email}
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </ScrollableContent>
              <ButtonsContainer gap={24} justify="end">
                {searchMember.length <= 0 && (
                  <Checkbox
                    checked={isCheckAll}
                    handleSelectAll={handleSelectAll}
                    id="selectAll"
                    label="Select all"
                    size="16"
                    hasSelectAll
                  />
                )}
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
                  onClick={handleUpdateUsers}
                >
                  Update
                </Button>
              </ButtonsContainer>
            </StyledDialogContent>
          </Portal>
        </Dialog>
      </StyledDialogContainer>
    );
  },
);

export default ListMembersDialog;
