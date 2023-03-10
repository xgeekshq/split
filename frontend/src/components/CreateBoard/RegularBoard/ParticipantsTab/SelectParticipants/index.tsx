import Flex from '@/components/Primitives/Layout/Flex';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import UsersBox from '@/components/CreateBoard/SplitBoard/SubTeamsTab/UsersBox';
import { useRecoilState } from 'recoil';
import { createBoardDataState } from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { useSession } from 'next-auth/react';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import Icon from '@/components/Primitives/Icon';
import Button from '@/components/Primitives/Button/Button';
import ListParticipants from '../ListParticipants';

const SelectParticipants = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const [usersList, setUsersList] = useRecoilState(usersListState);
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);

  const usersListNames = useMemo(
    () =>
      usersList.flatMap((user) =>
        createBoardData.users.find((member) => user._id === member.user) ? [user] : [],
      ),
    [createBoardData.users, usersList],
  );

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  useEffect(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === session?.user.id || user.isChecked,
    }));

    const users = updateCheckedUser.flatMap((user) =>
      user.isChecked
        ? [
            {
              role:
                user._id === session?.user.id ? BoardUserRoles.RESPONSIBLE : BoardUserRoles.MEMBER,
              user: user._id,
              votesCount: 0,
            },
          ]
        : [],
    );
    setUsersList(updateCheckedUser);

    setCreateBoardData((prev) => ({
      ...prev,
      users,
      board: { ...prev.board, team: null },
    }));
  }, []);

  return (
    <Flex direction="column" css={{ width: '100%' }}>
      <UsersBox haveError={false} participants={usersListNames} title="Participants" />
      <Flex justify="end" css={{ mt: '$10' }}>
        <Button variant="link" size="sm" onClick={handleOpen}>
          <Icon name="plus" />
          Add/remove participants
        </Button>
      </Flex>
      <ListParticipants isOpen={isOpen} setIsOpen={setIsOpen} />
    </Flex>
  );
};
export default SelectParticipants;
