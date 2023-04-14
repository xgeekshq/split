import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import CheckboxUserItem from '@/components/Primitives/Inputs/Checkboxes/UserCheckbox/UserCheckbox';
import SearchInput from '@/components/Primitives/Inputs/SearchInput/SearchInput';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import useCurrentSession from '@/hooks/useCurrentSession';
import { UserList } from '@/types/team/userList';

export type UserListDialogProps = {
  usersList: UserList[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  confirmationHandler: (usersList: UserList[]) => void;
  title: string;
  confirmationLabel: string;
};

const UserListDialog = React.memo<UserListDialogProps>(
  ({ usersList, setIsOpen, isOpen, confirmationHandler, title, confirmationLabel }) => {
    const { userId, isSAdmin } = useCurrentSession();

    const [searchMember, setSearchMember] = useState<string>('');
    const [disableUpdate, setDisableUpdate] = useState<boolean>(false);

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
      const userAdminIndex = listToBeSorted.findIndex((user) => user._id === userId);
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
        user._id !== userId ? { ...user, isChecked: !isCheckAll } : user,
      );

      setIsCheckAll(!isCheckAll);
      setLocalUsersList(updateCheckedUsers);
    };

    const handleUpdateUsers = () => {
      setSearchMember('');
      confirmationHandler(localUsersList);
    };

    useEffect(() => {
      if (usersList.length <= 0) return;
      setLocalUsersList(sortUserList());
    }, [usersList]);

    useEffect(() => {
      setIsCheckAll(!localUsersList.map((user) => user.isChecked).includes(false));

      if (localUsersList.every((user) => !user.isChecked)) {
        setDisableUpdate(true);
      } else {
        setDisableUpdate(false);
      }
    }, [localUsersList]);

    return (
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <Flex css={{ height: '100%' }} data-testid="userListDialog" direction="column">
          <Dialog.Header title={confirmationLabel} />
          <Flex css={{ p: '$32' }} direction="column">
            <SearchInput
              currentValue={searchMember}
              placeholder="Search member"
              handleChange={(e) => {
                setSearchMember(e.target.value);
              }}
              handleClear={() => {
                setSearchMember('');
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
                  <Checkbox
                    checked={isCheckAll}
                    handleChange={handleSelectAll}
                    id="selectAll"
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
            css={{ height: '100%', overflowY: 'auto', py: '$16' }}
            direction="column"
            justify="start"
          >
            <Flex css={{ px: '$32' }} direction="column" gap={20}>
              {filteredList?.map((user) => (
                <CheckboxUserItem
                  key={user._id}
                  disabled={user._id === userId && !isSAdmin}
                  handleChecked={handleChecked}
                  user={user}
                />
              ))}
            </Flex>
          </Flex>
          <Dialog.Footer
            affirmativeLabel="Update"
            disabled={disableUpdate}
            handleAffirmative={handleUpdateUsers}
            handleClose={handleClose}
          />
        </Flex>
      </Dialog>
    );
  },
);

export default UserListDialog;
