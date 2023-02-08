import Icon from '@/components/icons/Icon';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import ListMembersDialog from '@/components/Teams/CreateTeam/ListMembersDialog';
import useParticipants from '@/hooks/useParticipants';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { BoardUserAddAndRemove, BoardUserToAdd } from '@/types/board/board.user';
import { UserList } from '@/types/team/userList';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const ParticipantsLayout: React.FC = ({ children }) => {
  const {
    addAndRemoveBoardParticipants: { mutate },
  } = useParticipants({ autoFetchBoardParticipants: false });

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const usersList = useRecoilValue(usersListState);
  const boardParticipants = useRecoilValue(boardParticipantsState);
  const boardId = router.query.boardId as string;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const saveParticipants = (checkedUserList: UserList[]) => {
    const listOfUsers = [...boardParticipants];
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);
    const unselectedUsers = checkedUserList.filter((user) => !user.isChecked);

    const addedUsers = selectedUsers.filter(
      (user) => !listOfUsers.some((boardUser) => boardUser.user._id === user._id),
    );

    const addedBoardUsersToSend: BoardUserToAdd[] = addedUsers.map((user) => ({
      user,
      board: boardId,
      role: BoardUserRoles.MEMBER,
      votesCount: 0,
    }));

    const removedBoardUsers = listOfUsers.filter((boardUser) =>
      unselectedUsers.some((user) => boardUser.user._id === user._id),
    );
    const removedBoardUsersIds: string[] = removedBoardUsers.map(
      (boardUser) => boardUser._id as string,
    );

    if (addedBoardUsersToSend.length > 0 || removedBoardUsersIds.length > 0) {
      const boardUsersToUpdate: BoardUserAddAndRemove = {
        addBoardUsers: addedBoardUsersToSend,
        removeBoardUsers: removedBoardUsersIds,
        boardId,
      };

      mutate(boardUsersToUpdate);
    }

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
