import React, { useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getPersonalBoardsRequest } from '@/api/boardService';
import ListBoards from '@/components/Boards/MyBoards/ListBoards';
import EmptyPersonalBoards from '@/components/Boards/MyBoards/ListPersonalBoards/EmptyPersonalBoards';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { createErrorMessage } from '@/constants/toasts';
import { toastState } from '@/store/toast/atom/toast.atom';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';

interface ListBoardsByTeamProps {
  userId: string;
  isSuperAdmin: boolean;
}

const ListPersonalBoards = ({ userId, isSuperAdmin }: ListBoardsByTeamProps) => {
  const setToastState = useSetRecoilState(toastState);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchBoardsByTeam = useInfiniteQuery(
    ['boards/personal'],
    ({ pageParam = 0 }) => getPersonalBoardsRequest(pageParam),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        const { hasNextPage, page } = lastPage;
        if (hasNextPage) return page + 1;
        return undefined;
      },
      onError: () => {
        setToastState(createErrorMessage('Error getting the boards'));
      },
    },
  );
  const { data, isLoading } = fetchBoardsByTeam;

  const dataByTeamAndDate = useMemo(() => {
    const teams = new Map<string, Team>();
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    data?.pages.forEach((page) => {
      page.boards?.forEach((board) => {
        const boardsOfTeam = boardsTeamAndDate.get('personal');
        const date = new Date(board.updatedAt).toDateString();
        if (!boardsOfTeam) {
          boardsTeamAndDate.set('personal', new Map([[date, [board]]]));
          return;
        }
        const boardsOfDay = boardsOfTeam.get(date);
        if (boardsOfDay) {
          boardsOfDay.push(board);
          return;
        }
        boardsOfTeam.set(date, [board]);
      });
    });
    return { boardsTeamAndDate, teams };
  }, [data?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoardsByTeam.hasNextPage) {
        fetchBoardsByTeam.fetchNextPage();
      }
    }
  };

  if (dataByTeamAndDate.boardsTeamAndDate.size === 0 && !isLoading) {
    return (
      <Flex key="personal" css={{ mb: '$24' }} direction="column">
        <EmptyPersonalBoards />
      </Flex>
    );
  }

  return (
    <ListBoards
      dataByTeamAndDate={dataByTeamAndDate}
      filter="personal"
      isLoading={isLoading}
      isSuperAdmin={isSuperAdmin}
      onScroll={onScroll}
      scrollRef={scrollRef}
      userId={userId}
    />
  );
};

export default ListPersonalBoards;
