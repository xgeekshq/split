import React, { Suspense, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';

import { getBoardRequest } from '@/api/boardService';
import { getAllUsers } from '@/api/userService';
import ParticipantsList from '@/components/Board/RegularBoard/ParticipantsList';
import RegularBoardHeader from '@/components/Board/RegularBoard/RegularHeader';
import QueryError from '@/components/Errors/QueryError';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { USERS_KEY } from '@/constants/react-query/keys';
import { DASHBOARD_ROUTE } from '@/constants/routes';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import useBoard from '@/hooks/useBoard';
import { boardInfoState, boardParticipantsState } from '@/store/board/atoms/board.atom';
import { usersListState } from '@/store/user.atom';
import { BoardUser } from '@/types/board/board.user';
import { UserList } from '@/types/team/userList';
import useUsers from '@hooks/users/useUsers';

// Sorts participants list to show responsibles first and then regular board members
export const sortParticipantsList = (
  boardUsers: BoardUser[],
  setBoardParticipants: SetterOrUpdater<BoardUser[]>,
) => {
  boardUsers.sort((a, b) => {
    const aFullName = `${a.user.firstName.toLowerCase()} ${a.user.lastName.toLowerCase()}`;
    const bFullName = `${b.user.firstName.toLowerCase()} ${b.user.lastName.toLowerCase()}`;

    return aFullName < bFullName ? -1 : 1;
  });
  const orderedResponsiblesList = boardUsers.filter(
    (boardUser) => boardUser.role === BoardUserRoles.RESPONSIBLE,
  );
  const orderedParticipantsList = boardUsers.filter(
    (boardUser) => boardUser.role === BoardUserRoles.MEMBER,
  );
  setBoardParticipants([...orderedResponsiblesList, ...orderedParticipantsList]);
};

const BoardParticipants = () => {
  const [boardParticipants, setBoardParticipants] = useRecoilState(boardParticipantsState);
  const [recoilBoard, setRecoilBoard] = useRecoilState(boardInfoState);

  // Hooks
  const {
    fetchBoard: { data: boardData, isError },
    handleFetchBoardOnError,
  } = useBoard({
    autoFetchBoard: true,
  });

  if (isError) {
    handleFetchBoardOnError();
  }

  useEffect(() => {
    if (boardData) {
      setRecoilBoard(boardData);
      sortParticipantsList([...boardData.board.users], setBoardParticipants);
    }
  }, [boardData, setBoardParticipants, setRecoilBoard]);

  const {
    fetchAllUsers: { data: usersData },
  } = useUsers();

  const setUsersListState = useSetRecoilState(usersListState);

  const handleMembersList = useCallback(() => {
    if (!usersData) return;

    const checkboxUsersList = usersData
      .map((user): UserList => {
        const userIsTeamMember = boardParticipants.some(
          (teamMember) => teamMember.user?._id === user._id,
        );
        return { ...user, isChecked: userIsTeamMember };
      })
      .sort((a, b) => Number(b.isChecked) - Number(a.isChecked));

    setUsersListState(checkboxUsersList);
  }, [boardParticipants, setUsersListState, usersData]);

  useEffect(() => {
    handleMembersList();
  }, [handleMembersList]);

  return recoilBoard ? (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Flex css={{ width: '100%', height: '100vh' }} direction="column" gap={32}>
          <RegularBoardHeader isParticipantsPage />
          <ParticipantsList createdBy={boardData?.board.createdBy._id} />
        </Flex>
      </QueryError>
    </Suspense>
  ) : (
    <LoadingPage />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boardId = String(context.query.boardId);

  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ['board', { id: boardId }],
      queryFn: () => getBoardRequest(boardId, context),
    });
    await queryClient.prefetchQuery({ queryKey: [USERS_KEY], queryFn: () => getAllUsers(context) });
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: DASHBOARD_ROUTE,
      },
    };
  }
  return {
    props: {
      key: `/boards/${boardId}/participants`,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default BoardParticipants;
