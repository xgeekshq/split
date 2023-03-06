import React, { useMemo, useRef } from 'react';

import { getBoardsRequest } from '@/api/boardService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Flex';
import { User } from '@/types/user/user';
import { ScrollableContent } from '../styles';
import TeamHeader from '../../TeamHeader';
import EmptyTeamBoards from './EmptyTeamBoards';
import ListBoards from '../ListBoards';

interface ListBoardsByTeamProps {
  filteredTeam: Team;
  userId: string;
  isSuperAdmin: boolean;
}

const ListBoardsByTeam = ({ filteredTeam, userId, isSuperAdmin }: ListBoardsByTeamProps) => {
  const setToastState = useSetRecoilState(toastState);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchBoardsByTeam = useInfiniteQuery(
    ['boards', filteredTeam.id],
    ({ pageParam = 0 }) => getBoardsRequest(pageParam, filteredTeam.id),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        const { hasNextPage, page } = lastPage;
        if (hasNextPage) return page + 1;
        return undefined;
      },
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the boards',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );
  const { data, isLoading } = fetchBoardsByTeam;

  const dataByTeamAndDate = useMemo(() => {
    const createdByUsers = new Map<string, User>();
    const teams = new Map<string, Team>();
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    data?.pages.forEach((page) => {
      page.boards?.forEach((board) => {
        const boardsOfTeam = boardsTeamAndDate.get(`${board.team?.id ?? board.createdBy._id}`);
        const date = new Date(board.updatedAt).toDateString();
        if (!boardsOfTeam) {
          boardsTeamAndDate.set(
            `${board.team?.id ?? board.createdBy._id}`,
            new Map([[date, [board]]]),
          );
          if (board.team) teams.set(`${board.team?.id}`, board.team);
          else createdByUsers.set(`${board.createdBy._id}`, board.createdBy);
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
    return { boardsTeamAndDate, teams, createdByUsers };
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
      <ScrollableContent direction="column" justify="start" ref={scrollRef} onScroll={onScroll}>
        <Flex key={filteredTeam.id} css={{ mb: '$24' }} direction="column">
          <Flex
            direction="column"
            css={{
              position: 'sticky',
              zIndex: '5',
              top: '-0.4px',
              backgroundColor: '$background',
            }}
          >
            <TeamHeader team={filteredTeam} userId={userId} users={filteredTeam.users} />
          </Flex>
          <EmptyTeamBoards teamId={filteredTeam.id} />
        </Flex>
      </ScrollableContent>
    );
  }

  return (
    <ListBoards
      userId={userId}
      isSuperAdmin={isSuperAdmin}
      dataByTeamAndDate={dataByTeamAndDate}
      scrollRef={scrollRef}
      onScroll={onScroll}
      filter={filteredTeam.id}
      isLoading={isLoading}
    />
  );
};

export default ListBoardsByTeam;
