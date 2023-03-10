import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Layout/Flex';
import Checkbox from '@/components/Primitives/Checkbox';
import { UserList } from '@/types/team/userList';
import Separator from '@/components/Primitives/Separator';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import CheckboxUserItem from './partials/CheckboxUserItem';

export type UserListDialogProps = {
  usersList: UserList[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  title: string;
  confirmationLabel: string;
  confirmationHandler: (usersList: UserList[]) => void;
};

const UserListDialog = React.memo<UserListDialogProps>(
  ({ usersList, setIsOpen, isOpen, title, confirmationLabel, confirmationHandler }) => {
    const { data: session } = useSession({ required: false });

    const [searchMember, setSearchMember] = useState<string>('');

    const [localUsersList, setLocalUsersList] = useState(usersList);
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

    const filteredList = useMemo(() => {
      const searchString = searchMember.toLowerCase().trim();

      return localUsersList.filter((user) => {
        const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
        const email = user.email.toLowerCase();

        return (
          email.includes(searchString) || fullName.includes(searchString) || searchMember === ''
        );
      });
    }, [searchMember, localUsersList]);

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

    const handleClose = () => {
      setSearchMember('');
      setLocalUsersList(sortUserList);
      setIsOpen(false);
    };

    const handleChecked = (id: string) => {
      const updateCheckedUsers = localUsersList.map((user) =>
        user._id === id ? { ...user, isChecked: !user.isChecked } : user,
      );

      setLocalUsersList(updateCheckedUsers);
    };

    const handleSelectAll = () => {
      const updateCheckedUsers = localUsersList.map((user) =>
        user._id !== session?.user.id ? { ...user, isChecked: !isCheckAll } : user,
      );

      setIsCheckAll(!isCheckAll);
      setLocalUsersList(updateCheckedUsers);
    };

    const handleUpdateUsers = () => {
      setSearchMember('');
      confirmationHandler(localUsersList);
    };

    useEffect(() => {
      if (usersList.length > 0) {
        setLocalUsersList(sortUserList());
      }
    }, [usersList]);

    useEffect(() => {
      setIsCheckAll(!localUsersList.map((user) => user.isChecked).includes(false));
    }, [localUsersList]);

    return (
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <Dialog.Header title={confirmationLabel} />
        <Flex css={{ p: '$32' }} direction="column">
          <SearchInput
            currentValue={searchMember}
            handleChange={(e) => {
              setSearchMember(e.target.value);
            }}
            handleClear={() => {
              setSearchMember('');
            }}
            placeholder="Search member"
          />
        </Flex>
        <Text css={{ display: 'block', px: '$32', pb: '$24' }} heading="4">
          {title}
        </Text>
        <Flex direction="column" gap={8}>
          <Flex align="center" css={{ px: '$32' }}>
            <Flex css={{ flex: 1 }}>
              <Flex align="center" gap={8}>
                <Checkbox
                  id="selectAll"
                  checked={isCheckAll}
                  handleChange={handleSelectAll}
                  size="md"
                />
                <Text heading={5}>Name</Text>
              </Flex>
            </Flex>
            <Flex css={{ flex: 1 }}>
              <Text heading={5}>Email</Text>
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
            {filteredList?.map((user) => (
              <CheckboxUserItem
                key={user._id}
                user={user}
                disabled={user._id === session?.user.id && !session?.user.isSAdmin}
                handleChecked={handleChecked}
              />
            ))}
          </Flex>
        </Flex>
        <Flex
          justify="end"
          align="center"
          css={{ padding: '$32', borderTop: '1px solid $colors$primary100' }}
        >
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

export default UserListDialog;
