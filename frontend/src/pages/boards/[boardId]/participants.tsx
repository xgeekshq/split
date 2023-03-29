import { GetServerSideProps } from 'next';
import React, { Suspense, useCallback, useEffect } from 'react';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';

import { getBoardRequest } from '@/api/boardService';
import { getAllUsers } from '@/api/userService';
import ParticipantsList from '@/components/Board/RegularBoard/ParticipantsList';
import RegularBoardHeader from '@/components/Board/RegularBoard/RegularHeader';
import QueryError from '@/components/Errors/QueryError';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import useBoard from '@/hooks/useBoard';
import { boardInfoState, boardParticipantsState } from '@/store/board/atoms/board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { BoardUser } from '@/types/board/board.user';
import { UserList } from '@/types/team/userList';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';

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
  const setToastState = useSetRecoilState(toastState);
  const [boardParticipants, setBoardParticipants] = useRecoilState(boardParticipantsState);
  const [recoilBoard, setRecoilBoard] = useRecoilState(boardInfoState);

  // Hooks
  const {
    fetchBoard: { data: boardData },
  } = useBoard({
    autoFetchBoard: true,
  });

  useEffect(() => {
    if (boardData) {
      setRecoilBoard(boardData);
      sortParticipantsList([...boardData.board.users], setBoardParticipants);
    }
  }, [boardData, setBoardParticipants, setRecoilBoard]);

  const usersData = useQuery(['users'], () => getAllUsers(), {
    enabled: true,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    },
  }).data;

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
        <Flex direction="column" gap={32} css={{ width: '100%', height: '100vh' }}>
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

  if (boardId.includes('.map'))
    return {
      props: {},
    };

  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery(['board', { id: boardId }], () =>
      getBoardRequest(boardId, context),
    );
    await queryClient.prefetchQuery(['users'], () => getAllUsers(context));
  } catch (e) {
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
