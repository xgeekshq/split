import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Dialog from '@/components/Primitives/Dialog';
import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Flex';
import Checkbox from '@/components/Primitives/Checkbox';
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
    const { data: session } = useSession({ required: false });
    const [searchMember, setSearchMember] = useState<string>('');

    const [usersChecked, setUsersChecked] = useState(usersList);

    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

    // References
    const scrollRef = useRef<HTMLDivElement>(null);

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

    // Method to close dialog
    const handleClose = () => {
      setSearchMember('');
      setUsersChecked(sortUserList());
      setIsOpen(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchMember(event.target.value);
    };

    const handleClearSearch = () => {
      setSearchMember('');
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
      if (usersList.length <= 0) return;

      setUsersChecked(sortUserList());
    }, [usersList]);

    // Update selectAll button when list is all checked
    useEffect(() => {
      setIsCheckAll(!usersChecked.map((user) => user.isChecked).includes(false));
    }, [setIsCheckAll, usersChecked]);

    return (
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <Dialog.Header title={btnTitle} />
        <Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
          <SearchInput
            currentValue={searchMember}
            handleChange={handleSearchChange}
            handleClear={handleClearSearch}
            icon="search"
            iconPosition="both"
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
                    id={user._id}
                    checked={user.isChecked}
                    handleChange={() => {
                      handleChecked(user._id);
                    }}
                    disabled={user._id === session?.user.id && !session?.user.isSAdmin}
                    label={`${user.firstName} ${user.lastName}`}
                    size="md"
                  />
                </Flex>
                <Flex css={{ width: '50%' }}>
                  <Text color="primary300" css={{ textAlign: 'left', width: '50%' }} size="sm">
                    {user.email}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </ScrollableContent>
        <Flex
          justify="between"
          align="center"
          css={{ padding: '$32', borderTop: '1px solid $colors$primary100' }}
        >
          {searchMember.length <= 0 && (
            <Checkbox
              id="selectAll"
              checked={isCheckAll}
              handleChange={handleSelectAll}
              label="Select all"
              size="md"
            />
          )}
          <Dialog.Footer
            handleAffirmative={handleUpdateUsers}
            handleClose={handleClose}
            affirmativeLabel="Update"
            showSeparator={false}
          />
        </Flex>
      </Dialog>
    );
  },
);

export default ListMembersDialog;
