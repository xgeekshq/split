import Icon from '@/components/icons/Icon';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import ListMembersDialog from '@/components/Teams/CreateTeam/ListMembersDialog';
import useParticipants from '@/hooks/useParticipants';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { BoardUserAddAndRemove, BoardUserToAdd } from '@/types/board/board.user';
import { UserList } from '@/types/team/userList';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

const ParticipantsLayout: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const setToastState = useSetRecoilState(toastState);
  const {
    addAndRemoveBoardParticipants: { mutate },
  } = useParticipants({ autoFetchBoardParticipants: false });
  const router = useRouter();

  const [usersList, setUsersList] = useRecoilState(usersListState);
  const [boardParticipants, setBoardParticipants] = useRecoilState(boardParticipantsState);
  const { data: session } = useSession({ required: true });
  const boardId = router.query.boardId as string;

  const saveParticipants = (checkedUserList: UserList[]) => {
    const listOfUsers = [...boardParticipants];
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);
    const unselectedUsers = checkedUserList.filter((user) => !user.isChecked);

    const addedUsers = selectedUsers.filter(
      (user) => !listOfUsers.some((teamUser) => teamUser.user?._id === user._id),
    );

    const addedBoardUsersToSend: BoardUserToAdd[] = addedUsers.map((user) => ({
      user,
      role: BoardUserRoles.MEMBER,
      votesCount: 0,
    }));

    const removedBoardUsers = listOfUsers.filter((boardUser) =>
      unselectedUsers.some((user) => boardUser.user?._id === user._id),
    );
    const removedBoardUsersIds: string[] = removedBoardUsers.map((user) => user._id as string);

    if (addedBoardUsersToSend.length > 0 || removedBoardUsersIds.length > 0) {
      const boardUsersToUpdate: BoardUserAddAndRemove = {
        addBoardUsers: addedBoardUsersToSend,
        removeBoardUsers: removedBoardUsersIds,
        boardId,
      };

      mutate(boardUsersToUpdate);
    }

    const updatedListWithAdded = selectedUsers.map(
      (user) =>
        listOfUsers.find((member) => member.user._id === user._id) || {
          user,
          role: BoardUserRoles.MEMBER,
          votesCount: 0,
        },
    );

    // Sort by Name
    updatedListWithAdded.sort((a, b) => {
      const aFullName = `${a.user.firstName.toLowerCase()} ${a.user.lastName.toLowerCase()}`;
      const bFullName = `${b.user.firstName.toLowerCase()} ${b.user.lastName.toLowerCase()}`;

      return aFullName < bFullName ? -1 : 1;
    });

    // this insures that the team creator stays always in first
    const userAdminIndex = updatedListWithAdded.findIndex(
      (member) => member.user._id === session?.user.id,
    );

    updatedListWithAdded.unshift(updatedListWithAdded.splice(userAdminIndex, 1)[0]);

    setBoardParticipants(updatedListWithAdded);
    setUsersList(checkedUserList);

    setToastState({
      open: true,
      content: 'Team member/s successfully updated',
      type: ToastStateEnum.SUCCESS,
    });

    setIsOpen(false);
  };

  return (
    <ContentSection gap="36" justify="between">
      <Flex
        css={{ width: '100%', marginLeft: '152px', marginRight: '152px', mt: '50px' }}
        direction="column"
        gap="20"
      >
        <Flex justify="between">
          <Text heading="1">Participants</Text>
          <Button size="md" onClick={handleOpen}>
            <Icon css={{ color: 'white' }} name="plus" />
            Add/remove participants
          </Button>
        </Flex>
        {children}
      </Flex>
      <ListMembersDialog
        usersList={usersList}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        saveUsers={saveParticipants}
        title="Board Participants"
        btnTitle="Add/remove participants"
      />
    </ContentSection>
  );
};

export default ParticipantsLayout;
