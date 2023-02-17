import { getBoardRequest } from '@/api/boardService';
import { getAllUsers } from '@/api/userService';
import ParticipantsList from '@/components/Board/RegularBoard/ParticipantsList';
import RegularBoardHeader from '@/components/Board/RegularBoard/ReagularHeader';
import QueryError from '@/components/Errors/QueryError';
import Flex from '@/components/Primitives/Flex';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import LoadingPage from '@/components/Primitives/Loading/Page';
import useBoard from '@/hooks/useBoard';
import { boardInfoState, boardParticipantsState } from '@/store/board/atoms/board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { BoardUser } from '@/types/board/board.user';
import { UserList } from '@/types/team/userList';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import React, { Suspense, useCallback, useEffect } from 'react';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';

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
  const { data: session } = useSession({ required: true });
  const setToastState = useSetRecoilState(toastState);
  const [boardParticipants, setBoardParticipants] = useRecoilState(boardParticipantsState);
  const setRecoilBoard = useSetRecoilState(boardInfoState);

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

  if (!session) return null;
  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <ContentSection gap="36" justify="between">
          <Flex css={{ width: '100%' }} direction="column">
            <Flex justify="between">
              <RegularBoardHeader isParticipantsPage />
            </Flex>
            <ParticipantsList />
          </Flex>
        </ContentSection>
      </QueryError>
    </Suspense>
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
    await queryClient.prefetchQuery(['users'], () => getAllUsers(context));
    await queryClient.fetchQuery(['board', { id: boardId }], () =>
      getBoardRequest(boardId, context),
    );
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: `/boards/${boardId}`,
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
