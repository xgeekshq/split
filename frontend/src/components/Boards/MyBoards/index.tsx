import React, { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { getBoardsRequest } from '@/api/boardService';
import EmptyBoards from '@/components/Dashboard/RecentRetros/partials/EmptyBoards';
import { toastState } from '@/store/toast/atom/toast.atom';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';
import { useRouter } from 'next/router';
import { teamsListState } from '@/store/team/atom/team.atom';
import { filterTeamBoardsState } from '@/store/board/atoms/board.atom';
import { User } from '@/types/user/user';
import FilterBoards from '../Filters/FilterBoards';
import ListBoardsByTeam from './ListBoardsByTeam';
import ListBoards from './ListBoards';
import ListPersonalBoards from './ListPersonalBoards';

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
  const userTeamsList = useRecoilValue(teamsListState);

  const fetchBoards = useInfiniteQuery(
    ['boards'],
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

  useEffect(() => {
    if (routerTeam) setFilterState(routerTeam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoards.hasNextPage) {
        fetchBoards.fetchNextPage();
      }
    }
  };

  const teamNames: OptionType[] = userTeamsList.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  if (filterState === 'all' && isEmpty(dataByTeamAndDate.boardsTeamAndDate.size) && !isLoading)
    return <EmptyBoards />;

  const filteredTeam: Team | undefined = userTeamsList.find((team) => team.id === filterState);

  return (
    <>
      <FilterBoards teamNames={teamNames} />

      {!['all', 'personal'].includes(filterState) && filteredTeam && (
        <ListBoardsByTeam filteredTeam={filteredTeam} userId={userId} isSuperAdmin={isSuperAdmin} />
      )}
      {filterState === 'personal' && (
        <ListPersonalBoards userId={userId} isSuperAdmin={isSuperAdmin} />
      )}
      {filterState === 'all' && (
        <ListBoards
          userId={userId}
          isSuperAdmin={isSuperAdmin}
          dataByTeamAndDate={dataByTeamAndDate}
          scrollRef={scrollRef}
          onScroll={onScroll}
          filter={filterState}
          isLoading={isLoading}
        />
      )}
    </>
  );
});

export default MyBoards;
