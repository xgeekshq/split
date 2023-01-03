import Flex from '@/components/Primitives/Flex';
import { useEffect, useMemo, useState } from 'react';
import UsersBox from '@/components/CreateBoard/SplitBoard/SubTeamsTab/UsersBox';
import { useRecoilState } from 'recoil';
import { createBoardDataState } from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { useSession } from 'next-auth/react';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
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

  useEffect(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === session?.user.id,
    }));

    const users = updateCheckedUser.flatMap((user) =>
      user._id === session?.user.id
        ? [{ role: BoardUserRoles.RESPONSIBLE, user: user._id, votesCount: 0 }]
        : [],
    );
    setUsersList(updateCheckedUser);

    setCreateBoardData((prev) => ({
      ...prev,
      users,
      board: { ...prev.board, team: null },
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction="column" css={{ width: '100%' }}>
      <UsersBox haveError={false} participants={usersListNames} title="Participants" />
      <ListParticipants isOpen={isOpen} setIsOpen={setIsOpen} />
    </Flex>
  );
};
export default SelectParticipants;
