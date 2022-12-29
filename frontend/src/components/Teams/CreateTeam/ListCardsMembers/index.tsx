import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import Dialog from '@/components/Primitives/Dialog/index';
import Checkbox from '@/components/Primitives/Checkbox';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { verifyIfIsNewJoiner } from '@/utils/verifyIfIsNewJoiner';
import { CreateTeamUser, TeamUserAddAndRemove } from '@/types/team/team.user';
import { toastState } from '@/store/toast/atom/toast.atom';
import { useRouter } from 'next/router';
import useTeam from '@/hooks/useTeam';
import Icon from '@/components/icons/Icon';
import SearchInput from '../ListMembers/SearchInput';
import { ScrollableContent } from './styles';
import CardMember from '../CardMember';
import { ButtonAddMember } from '../ListMembers/styles';

const TeamMembersList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    addAndRemoveTeamUser: { mutate },
  } = useTeam({ autoFetchTeam: false });

  const router = useRouter();

  const { data: session } = useSession({ required: true });
  const [searchMember, setSearchMember] = useState<string>('');

  const [usersList, setUsersListState] = useRecoilState(usersListState);
  const [membersList, setMembersListState] = useRecoilState(membersListState);

  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const setToastState = useSetRecoilState(toastState);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMember(event.target.value);
  };

  const handleChecked = (id: string) => {
    const updateCheckedUser = usersList.map((user) =>
      user._id === id ? { ...user, isChecked: !user.isChecked } : user,
    );

    setUsersListState(updateCheckedUser);
  };

  // Update selectAll button when list is all checked
  useEffect(() => {
    setIsCheckAll(usersList.every((user) => user.isChecked === true));
  }, [setIsCheckAll, usersList]);

  // Remove selectAll button when user is filtering by name/email
  useEffect(() => {
    setIsFiltering(searchMember.length > 0);
  }, [searchMember.length, setIsFiltering]);

  const filteredList = useMemo(() => {
    const searchString = searchMember.toLowerCase().trim();

    return usersList.filter((user) => {
      const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
      const email = user.email.toLowerCase();
      return email.includes(searchString) || fullName.includes(searchString) || searchMember === '';
    });
  }, [searchMember, usersList]);

  const handleSelectAll = () => {
    const updateCheckedUser = usersList.map((user) =>
      user._id !== session?.user.id ? { ...user, isChecked: !isCheckAll } : user,
    );
    setIsCheckAll(!isCheckAll);
    setUsersListState(updateCheckedUser);
  };

  const saveMembers = () => {
    const listOfUsers = [...membersList];

    const selectedUsers = usersList.filter((user) => user.isChecked);
    const unselectedUsers = usersList.filter((user) => !user.isChecked);
    const { teamId } = router.query;

    if (teamId) {
      const team = teamId as string;

      const addedUsers = selectedUsers.filter(
        (user) => !listOfUsers.some((teamUser) => teamUser.user._id === user._id),
      );

      const addedUsersToSend: CreateTeamUser[] = addedUsers.map((teamUser) => ({
        user: teamUser._id,
        role: TeamUserRoles.MEMBER,
        isNewJoiner: verifyIfIsNewJoiner(teamUser.joinedAt, teamUser.providerAccountCreatedAt),
        team,
      }));

      const removedUsers = listOfUsers.filter((teamUser) =>
        unselectedUsers.some((user) => teamUser.user._id === user._id),
      );
      const removedUsersIds = removedUsers.map((user) => user._id);
      if (addedUsersToSend.length > 0 || removedUsersIds.length > 0) {
        const usersToUpdate: TeamUserAddAndRemove = {
          addUsers: addedUsersToSend,
          removeUsers: removedUsersIds,
          team,
        };

        mutate(usersToUpdate);
      }

      setIsOpen(false);

      return;
    }

    const updatedListWithAdded = selectedUsers.map(
      (user) =>
        listOfUsers.find((member) => member.user._id === user._id) || {
          user,
          role: TeamUserRoles.MEMBER,
          isNewJoiner: verifyIfIsNewJoiner(user.joinedAt, user.providerAccountCreatedAt),
        },
    );

    // this insures that the team creator stays always in first

    const userAdminIndex = updatedListWithAdded.findIndex(
      (member) => member.user._id === session?.user.id,
    );

    updatedListWithAdded.unshift(updatedListWithAdded.splice(userAdminIndex, 1)[0]);

    setToastState({
      open: true,
      content: 'Team member/s successfully updated',
      type: ToastStateEnum.SUCCESS,
    });

    setMembersListState(updatedListWithAdded);

    setIsOpen(false);
  };

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <Flex css={{ mt: '$38' }} direction="column">
      <Flex>
        <Text css={{ mb: '$16', flex: 1 }} heading="3">
          Team Members
        </Text>
        <ButtonAddMember onClick={handleOpen}>
          <Icon css={{ width: '$16', height: '$16' }} name="plus" />
          <Text
            weight="medium"
            css={{
              ml: '$10',
              fontSize: '$14',
              lineHeight: '$18',
            }}
          >
            Add/remove members
          </Text>
        </ButtonAddMember>
      </Flex>
      <ScrollableContent direction="column" justify="start">
        {membersList?.map((member) => (
          <CardMember
            key={member.user._id}
            isNewTeamPage
            isTeamCreator={member.user._id === session?.user.id}
            member={member}
          />
        ))}
      </ScrollableContent>
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <Dialog.Header>
          <Text heading="4">Add/remove team members</Text>
        </Dialog.Header>
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
          Team Members
        </Text>
        <ScrollableContent direction="column" justify="start">
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
                  <Text color="primary300" css={{ textAlign: 'left', width: '50%' }} size="sm">
                    {user.email}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
          <Dialog.Footer
            affirmativeLabel="Update"
            handleAffirmative={saveMembers}
            setIsOpen={setIsOpen}
          >
            {!isFiltering && (
              <Checkbox
                checked={isCheckAll}
                handleSelectAll={handleSelectAll}
                id="selectAll"
                label="Select all"
                size="16"
                hasSelectAll
              />
            )}
          </Dialog.Footer>
        </ScrollableContent>
      </Dialog>
    </Flex>
  );
};

export default TeamMembersList;
