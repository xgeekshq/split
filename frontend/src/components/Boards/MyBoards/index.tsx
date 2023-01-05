import React, { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { getBoardsRequest } from '@/api/boardService';
import EmptyBoards from '@/components/Dashboard/RecentRetros/partials/EmptyBoards';
import { useSocketBoardIO } from '@/hooks/useSocketBoardIO';
import { toastState } from '@/store/toast/atom/toast.atom';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';
import { useRouter } from 'next/router';
import { teamsListState } from '@/store/team/atom/team.atom';
import { filterTeamBoardsState } from '@/store/board/atoms/board.atom';
import FilterBoards from '../Filters/FilterBoards';
import ListBoardsByTeam from './ListBoardsByTeam';
import ListBoards from './ListBoards';

interface MyBoardsProps {
  userId: string;
  isSuperAdmin: boolean;
}

export interface OptionType {
  value: string;
  label: string;
}

const MyBoards = React.memo<MyBoardsProps>(({ userId, isSuperAdmin }) => {
  const setToastState = useSetRecoilState(toastState);
  const [filterState, setFilterState] = useRecoilState(filterTeamBoardsState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const routerTeam = router.query.team as string;
  const teamsList = useRecoilValue(teamsListState);

  const fetchBoards = useInfiniteQuery(
    'boards',
    ({ pageParam = 0 }) => getBoardsRequest(pageParam),
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

  const { data, isLoading } = fetchBoards;

  console.log('data', data);

  const teamSocketId = data?.pages[0].boards[0].team
    ? data?.pages[0].boards[0].team._id
    : undefined;

  // socketId
  const { socket, queryClient } = useSocketBoardIO(teamSocketId);

  useEffect(() => {
    if (!socket) return;
    socket.on('teamId', () => {
      queryClient.invalidateQueries('boards');
    });
  }, [socket, queryClient]);

  useEffect(() => {
    if (routerTeam) setFilterState(routerTeam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataByTeamAndDate = useMemo(() => {
    const teams = new Map<string, Team>();
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    data?.pages.forEach((page) => {
      page.boards?.forEach((board) => {
        const boardsOfTeam = boardsTeamAndDate.get(`${board.team?._id ?? `personal`}`);
        const date = new Date(board.updatedAt).toDateString();
        if (!boardsOfTeam) {
          boardsTeamAndDate.set(`${board.team?._id ?? `personal`}`, new Map([[date, [board]]]));
          if (board.team) teams.set(`${board.team?._id}`, board.team);
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
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoards.hasNextPage) {
        fetchBoards.fetchNextPage();
      }
    }
  };

  const teamNames: OptionType[] = teamsList.map((team) => ({
    value: team._id,
    label: team.name,
  }));

  if (filterState === 'all' && isEmpty(dataByTeamAndDate.boardsTeamAndDate.size) && !isLoading)
    return <EmptyBoards />;

  const filteredTeam: Team | undefined = teamsList.find((team) => team._id === filterState);

  return (
    <>
      <FilterBoards teamNames={teamNames} />

      {!['all', 'personal'].includes(filterState) && filteredTeam && (
        <ListBoardsByTeam
          filteredTeam={filteredTeam}
          userId={userId}
          isSuperAdmin={isSuperAdmin}
          socket={socket}
        />
      )}

      <ListBoards
        userId={userId}
        isSuperAdmin={isSuperAdmin}
        dataByTeamAndDate={dataByTeamAndDate}
        scrollRef={scrollRef}
        onScroll={onScroll}
        filter={filterState}
        isLoading={isLoading}
        socket={socket}
      />
    </>
  );
});

export default MyBoards;
